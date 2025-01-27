import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { FindAllParameters, TaskDto, TaskRouteParameters } from './task.dto';
import { TaskService } from './task.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('task')
export class TaskController {

    constructor(private readonly taskServices: TaskService) { }

    @Post()
    // method
    public async create(@Body() task: TaskDto): Promise<TaskDto> {
        return await this.taskServices.create(task);
    };

    @Get('/:id')
    public async findById(@Param('id') id: string): Promise<TaskDto> {
        return this.taskServices.findById(id);
    };

    @Get()
    public async findAll(@Query() params: FindAllParameters): Promise<TaskDto[]> {
        return this.taskServices.findAll(params);
    }

    @Put('/:id')
    public async update(@Param() params: TaskRouteParameters, @Body() task: TaskDto) {
        await this.taskServices.update(params.id, task);
    };

    @Delete('/:id')
    public remove(@Param('id') id: string) {
        return this.taskServices.remove(id);
    };
}
