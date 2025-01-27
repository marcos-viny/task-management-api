import { HttpException, HttpStatus, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { FindAllParameters, TaskDto, TaskRouteParameters, TaskStatusEnum } from './task.dto';
import { NotFoundError, throwError } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from 'src/db/entities/task.entity';
import { FindOptions, FindOptionsWhere, Like, Repository } from 'typeorm';

@Injectable()
export class TaskService {

    private tasks: TaskDto[] = [];
    private mapEntityToDo(taskEntity: TaskEntity): TaskDto {
        return {
            id: taskEntity.id,
            title: taskEntity.title,
            description: taskEntity.description,
            expirationDate: taskEntity.expirationDate,
            status: TaskStatusEnum[taskEntity.status]
        }
    };
    private mapDtoToEntity(taskDto: TaskDto): Partial<TaskEntity> {
        return {
            title: taskDto.title,

            description: taskDto.description,
            expirationDate: taskDto.expirationDate,
            status: taskDto.status.toString()
        }
    };

    constructor(
        @InjectRepository(TaskEntity)
        private readonly taskRepository: Repository<TaskEntity>
    ) { };

    public async create(task: TaskDto) {
        const taskToSave: TaskEntity = {
            title: task.title,
            description: task.description,
            expirationDate: task.expirationDate,
            status: TaskStatusEnum.TO_DO,
        }

        const createdTask = await this.taskRepository.save(taskToSave);

        return this.mapEntityToDo(createdTask);
    };

    public async findById(id: string): Promise<TaskDto> {
        const foundTask: any = await this.taskRepository.findOne({ where: { id } })

        if (!foundTask) {
            throw new HttpException(`Task with is ${id} not found.`, HttpStatus.NOT_FOUND);
        }

        return this.mapEntityToDo(foundTask);
        // throw new NotFoundException(`Task with is ${id} not found.`);
    };

    public async findAll(params: FindAllParameters): Promise<TaskDto[]> {
        const searchParams: FindOptionsWhere<TaskEntity> = {};

        if (params.title) {
            searchParams.title = Like(`%${params.title}%`);
        }

        if (params.status) {
            searchParams.title = Like(`%${params.status}%`);
        }

        const taskFound = await this.taskRepository.find({
            where: searchParams
        });

        return taskFound.map(taskEntity => this.mapEntityToDo(taskEntity));
    };

    public async update(id: string, task: TaskDto) {
        const foundTask = await this.taskRepository.findOne({ where: { id } });

        if (!foundTask) {
            throw new HttpException(`Task with is ${task?.id} not found`, HttpStatus.BAD_REQUEST);
        }

        await this.taskRepository.update(id, this.mapDtoToEntity(task));
    };

    public async remove(id: string) {
        const result = await this.taskRepository.delete(id);

        if (!result.affected) {
            throw new HttpException(`Task with id ${id} not found`, HttpStatus.BAD_REQUEST);
        }
    };


}
