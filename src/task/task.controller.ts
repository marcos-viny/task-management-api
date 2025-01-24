import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { FindAllParameters, TaskDto } from './task.dto';
import { TaskService } from './task.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('task')
export class TaskController {

    constructor(private readonly taskServices: TaskService) { }

    @Post()
    // method
    public create(@Body() task: TaskDto) {
        this.taskServices.create(task);
    };

    @Get('/:id')
    public findById(@Param('id') id: string): TaskDto {
        return this.taskServices.findById(id);
    };

    @Get()
    public findAll(@Query() params: FindAllParameters): TaskDto[] {
        return this.taskServices.findAll(params);
    }

    @Put()
    public update(@Body() task: TaskDto) {
        this.taskServices.update(task);
    };

    @Delete('/:id')
    public remove(@Param('id') id: string) {
        return this.taskServices.remove(id);
    };
}
