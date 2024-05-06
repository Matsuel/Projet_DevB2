import { ReviewMonitor } from '@/types/Monitor';
import axios from 'axios';
import { socket } from '@/pages/_app';

export const handleSubmitAutoecole = async (router: any, autoecoleReview: any, token: string) => {
  try {
    socket.emit('reviewsautoecole', { review: autoecoleReview, token: token });
  } catch (error) {
    console.log(error);
  }
};

export const fetchData = async (setMonitorsReview: Function, token: string, router: any) => {
  try {
    socket.emit('autoecoleinfos', { token: token });
  } catch (error) {
    console.log(error);
  }
};

export const handleSubmitMonitor = async (monitor: ReviewMonitor, token: string, router: any) => {
  try {
    socket.emit('reviewsmonitor', { review: monitor, token: token });
  } catch (error) {
    console.log(error);
  }
};