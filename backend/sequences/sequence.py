from models import random_id
from errors import NotFoundError, BadRequestError
from .sequence_job import SequenceJob
import os
from app import logger
import system.controller

class Sequence:
    def __init__(self, name, upload_path, camera, filter_wheel=None, id=None, sequence_jobs=None, status=None):
        self.name = name
        self.upload_path = upload_path
        self.camera = camera
        self.filter_wheel = filter_wheel
        self.id = random_id(id)
        self.sequence_jobs = sequence_jobs if sequence_jobs else []
        self.status = status if status else 'idle'
        self.running_sequence_job = None

    def job(self, sequence_job_id):
        sequence_job = [x for x in self.sequence_jobs if x.id == sequence_job_id]
        if sequence_job:
            return sequence_job[0]
        raise NotFoundError()

    def update(self, json):
        self.name = json['name']
        self.upload_path = json['directory']
        self.camera = json['camera']
        self.filter_wheel = json['filterWheel']

    @staticmethod
    def from_map(map_object):
        return Sequence(
            map_object['name'],
            map_object['directory'],
            map_object['camera'],
            map_object['filterWheel'],
            id=map_object['id'],
            sequence_jobs=[SequenceJob.from_map(x) for x in map_object['sequenceJobs']],
            status='stale' if map_object['status'] == 'running' and not system.controller.sequences_runner.is_running(map_object['id']) else map_object['status']
        )

    @staticmethod
    def import_from_data(data):
        data['id'] = random_id()
        for job in data['sequenceJobs']:
            job['id'] = random_id()
        return Sequence.from_map(data)

    def to_map(self):
        return {
            'id': self.id,
            'name': self.name,
            'camera': self.camera,
            'filterWheel': self.filter_wheel,
            'directory': self.upload_path,
            'sequenceJobs': [x.to_map() for x in self.sequence_jobs],
            'status': self.status,
        }

    def is_running(self):
        return self.status == 'running'

    def duplicate(self):
        new_sequence = Sequence(self.name + ' (copy)', self.upload_path + ' (copy)', self.camera, self.filter_wheel)
        for job in self.sequence_jobs:
            new_sequence.sequence_jobs.append(job.duplicate())

        return new_sequence

    def stop(self, on_update=None):
        if not self.is_running() or not self.running_sequence_job:
            raise BadRequestError('Sequence not running')
        self.status = 'stopped'
        self.running_sequence_job.stop()
        if on_update:
            on_update()


    def reset(self):
        for sequence_job in self.sequence_jobs:
            self.status = 'idle'
            logger.debug('resetting sequence job {}'.format(sequence_job))
            sequence_job.reset()

    def run(self, server, root_directory, event_listener, logger, on_update=None):
        camera = [c for c in server.cameras() if c.id == self.camera]
        if not camera:
            raise NotFoundError('Camera with id {} not found'.format(self.camera))
        camera = camera[0]

        filter_wheel = None
        if self.filter_wheel:
            filter_wheel = [f for f in server.filter_wheels() if f.id == self.filter_wheel]
            if not filter_wheel:
                raise NotFoundError('Filter wheel with id {} not found'.format(self.filter_wheel))
            filter_wheel = filter_wheel[0]

        sequence_root_path = os.path.join(root_directory, self.upload_path)

 
        logger.debug('Starting sequence with camera: {}={} and filter_wheel: {}={}'.format(self.camera, camera.device.name, self.filter_wheel, filter_wheel.device.name if filter_wheel else 'N/A'))

        self.status = 'starting'

        for sequence_job in self.sequence_jobs:
            if self.is_todo(sequence_job) and sequence_job.status != 'stopped':
                logger.debug('resetting sequence job {}'.format(sequence_job))
                sequence_job.reset()

        on_update()
        try:
            os.makedirs(sequence_root_path, exist_ok=True)

            self.status = 'running'
            for index, sequence_job in enumerate(self.sequence_jobs):
                if self.status == 'stopped':
                    return
                if self.is_todo(sequence_job):
                    self.running_sequence_job = sequence_job
                    sequence_job.run(server, {'camera': camera, 'filter_wheel': filter_wheel}, sequence_root_path, logger, event_listener, on_update, index=index)
            self.status = 'finished'
            on_update()
        except Exception as e:
            logger.exception('error running sequence')
            self.status = 'error'
            on_update()
            raise e
        finally:
            self.running_sequence_job = None

    def is_todo(self, sequence_job):
        return sequence_job.status != 'finished'

