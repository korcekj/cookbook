import { toast } from 'react-toastify';

import { InformationCircleIcon } from '@heroicons/react/solid';
import { ExclamationIcon } from '@heroicons/react/solid';
import { ExclamationCircleIcon } from '@heroicons/react/solid';
import { CheckCircleIcon } from '@heroicons/react/solid';

type ToastType = 'info' | 'success' | 'warning' | 'error';

interface ToastMessageProps {
  type: ToastType;
  message: string;
}

const displayIcon = (type: ToastType) => {
  switch (type) {
    case 'info':
      return <InformationCircleIcon className='text-blue-500' />;
    case 'warning':
      return <ExclamationIcon className='text-yellow-500' />;
    case 'error':
      return <ExclamationCircleIcon className='text-red-500' />;
    case 'success':
      return <CheckCircleIcon className='text-green-500' />;
    default:
      return <InformationCircleIcon className='text-blue-500' />;
  }
};

const ToastMessage = ({ type, message }: ToastMessageProps) => {
  return toast[type](
    <div className='flex items-center text-gray-700 rounded-md'>
      <span className='line-clamp-1 font-semibold'>{message}</span>
    </div>,
    {
      icon: displayIcon(type),
    }
  );
};

ToastMessage.dismiss = toast.dismiss;

export default ToastMessage;
