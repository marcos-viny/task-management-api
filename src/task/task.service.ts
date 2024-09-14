import { HttpException, HttpStatus, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { FindAllParameters, TaskDto } from './task.dto';
import { NotFoundError, throwError } from 'rxjs';

@Injectable()
export class TaskService {

    private tasks: TaskDto[] = [];

    public create(task: TaskDto) {
        this.tasks.push(task);
        console.log(this.tasks);
    };

    public findById(id: string): TaskDto {
        const foundTask: any = this.tasks.filter(t => t?.id === id);

        if (foundTask.length) {
            return foundTask[0];
        }

        // throw new NotFoundException(`Task with is ${id} not found.`);

        throw new HttpException(`Task with is ${id} not found.`, HttpStatus.NOT_FOUND);
    };

    public findAll(params: FindAllParameters): TaskDto[] {
        return this.tasks.filter(t => {
            let math = true;

            if (params?.title != undefined && !t.title.includes(params.title)) {
                math = false
            }
            if (params?.status != undefined && !t.status.includes(params.status)) {
                math = false
            }
            return math;
        })
    }

    public update(task: TaskDto) {
        let taskIndex: any = this.tasks.findIndex(t => t?.id === task?.id);

        if (taskIndex >= 0) {
            this.tasks[taskIndex] = task;
            return;
        }

        throw new HttpException(`Task with is ${task?.id} not found`, HttpStatus.BAD_REQUEST);
    };

    public remove(id: string) {
        let taskIndex: any = this.tasks.findIndex(t => t.id === id);

        if (taskIndex >= 0) {
            this.tasks.splice(taskIndex, 1);
            return;
        }

        throw new HttpException(`Task with id ${id} not found`, HttpStatus.BAD_REQUEST);
    };
}
