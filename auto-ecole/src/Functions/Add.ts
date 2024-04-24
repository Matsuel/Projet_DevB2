import { ReviewMonitor } from '@/types/Monitor';
import axios from 'axios';

export const handleSubmitAutoecole = async (router: any, autoecoleReview: any, token: string) => {
  try {
    const response = await axios.post('http://localhost:3500/reviewsautoecole', { review: autoecoleReview, token: token });
    if (response.data.posted) {
      router.push('/autoecole/' + response.data.autoEcoleId);
    } else {
      alert('Erreur lors de la publication de l\'avis');
    }
  } catch (error) {
    console.log(error);
  }
};

export const handleSubmitMonitor = async (monitor: ReviewMonitor, token: string, router: any) => {
  try {
    const response = await axios.post('http://localhost:3500/reviewsmonitor', { review: monitor, token: token });
    console.log(response.data);
    if (response.data.posted) {
      router.push('/autoecole/' + response.data.autoEcoleId);
    } else {
      alert('Erreur lors de la publication de l\'avis');
    }
  } catch (error) {
    console.log(error);
  }
};

export const fetchData = async (setMonitorsReview: Function, token: string, router: any) => {
  const response = await axios.post('http://localhost:3500/autoecoleinfos', { token: token });
  if (response.data.autoEcole) {
    const newMonitorsReview = response.data.autoEcole.monitors.map((monitor: any) => {
      return { stars: 0, comment: '', name: monitor.name, _id: monitor._id };
    });
    setMonitorsReview(newMonitorsReview);
  } else {
    router.push('/');
  }
};