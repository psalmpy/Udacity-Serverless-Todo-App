import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from './attachmentUtils'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'

// TODO: Implement businessLogic
const logger = createLogger('TodosAccess')
const attachmentUtils = new AttachmentUtils()
const todosAccess = new TodosAccess()

// create todo function
export const createTodo = async (
  newTodo: CreateTodoRequest,
  userId: string
): Promise<TodoItem> => {
  logger.info('Create todo function')
  const todoId = uuid.v4()
  const attachmentUrl = attachmentUtils.getAttachmentUrl(todoId)
  const createdAt = new Date().toString()
  const newItem = {
    userId,
    todoId,
    createdAt,
    attachmentUrl,
    done: false,
    ...newTodo
  }

  return await todosAccess.createTodoItem(newItem)
}

// get todo function
export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
  try {
    return await todosAccess.getAllTodos(userId)
  } catch (error) {
    createError('Error getting user todos ', error)
    return error
  }
}

// update todo function
export async function updateTodo(
  todoId: string,
  userId: string,
  updateTodoRequest: UpdateTodoRequest
): Promise<void> {
  createLogger('Updating todo')
  return await todosAccess.updateTodoItem(todoId, userId, updateTodoRequest)
}

// delete todo function
export async function deleteTodo(
  todoId: string,
  userId: string
): Promise<void> {
  return await todosAccess.deleteTodoItem(todoId, userId)
}

// create attachment presigned url function
export async function createAttachmentPresignedUrl(
  todoId: string
): Promise<String> {
  return attachmentUtils.getUploadUrl(todoId)
}