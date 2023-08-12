import { ApplicationError } from '@/protocols';

export function badrequestError(message: string): ApplicationError {
  return {
    name: 'BadRequestError',
    message,
  };
}