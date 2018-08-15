import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo } from 'todo/models/todo.model';
import { TodoController } from './todo.controller';

@Module({
  imports: [MongooseModule.forFeature([{name: Todo.modelName, schema: Todo.model.schema}])],
  providers: [TodoService],
  controllers: [TodoController]
})
export class TodoModule {}
