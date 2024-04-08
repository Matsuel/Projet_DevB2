import React, { useState } from 'react';
import Head from 'next/head';
import Header from "@/Components/Header";
import styles from '@/styles/Compte.module.css';
import useSWR from 'swr';
import axios from 'axios';
import { useForm, SubmitHandler } from "react-hook-form"
import { deleteAccount, editAccount, editNotifications } from '@/Functions/Compte';
import { AccountInputs, NotificationsInputs, UserInfos } from '@/types/Compte';

const fetcher = (url: string) => axios.get(url).then(res => res.data)



const Compte: React.FC = () => {
  const {
    register,
    handleSubmit
  } = useForm<AccountInputs>()

  const {
    register: registerNotifications,
    handleSubmit: handleSubmitNotifications,
  } = useForm<NotificationsInputs>()

  const [editError, setEditError] = useState<boolean>(false)
  const [notificationsEdit, setNotificationsEdit] = useState<boolean>(false)

  let token = ""

  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token') as string
  }

  const { data, error, isLoading } = useSWR<UserInfos>('http://localhost:3500/userInfos?token=' + token, fetcher)
  if (isLoading || !data) return <div>Chargement...</div>
  if (error) return <div>Erreur</div>
  console.log(data)

  const onSubmit: SubmitHandler<AccountInputs> = async (infos) => {
    if (infos.newPassword !== infos.newPasswordConfirm) {
      setEditError(true)
      return
    }
    const response = await editAccount(data._id, infos)
    response.edited ? localStorage.setItem('token', response.token) : setEditError(true)
  }

  const onSubmitNotifications: SubmitHandler<NotificationsInputs> = async infos => {
    const response = await editNotifications(data._id, infos)
    response.edited ? setNotificationsEdit(true) : setNotificationsEdit(false)
    setTimeout(() => {
      setNotificationsEdit(false)
    }, 3000)
  }

  const handleDeleteAccount = async () => {
    const response = await deleteAccount(data._id)
    if (response.deleted) {
      localStorage.removeItem('token')
      window.location.href = '/'
    }
  }

  return (
    <div>
      <Head>
        <title>Compte</title>
      </Head>
      <main>
        <Header />

        <h1>Compte</h1>
        <div className={styles.Compte_container}>
          {editError && <p>Erreur lors de la modification, les mots de passe ne correspondent pas, ou le mot de passe actuel est incorrect</p>}
          {notificationsEdit && <p>Notifications modifiées</p>}
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="email"
              placeholder={data.email}
              {...register("email")}
            />
            <input
              type="password"
              placeholder="Mot de passe actuel"
              {...register("password")}
              required
            />
            <input
              type="password"
              placeholder="Nouveau mot de passe"
              {...register("newPassword")}
            />
            <input
              type="password"
              placeholder="Confirmer le nouveau mot de passe"
              {...register("newPasswordConfirm")}
            />
            <button
              type="submit"
            >
              Modifier
            </button>
          </form>

          {}

          {data.acceptNotifications &&
            <form onSubmit={handleSubmitNotifications(onSubmitNotifications)}>
              <input
                type="checkbox"
                id="acceptNotifications"
                {...registerNotifications("acceptNotifications")}
                defaultChecked={data.acceptNotifications}
              />
              <label htmlFor="acceptNotifications">Accepter les notifications</label>
              <button
                type="submit"
              >
                Modifier
              </button>
            </form>
          }

          <button
            onClick={() => handleDeleteAccount()}
          >
            Supprimer le compte
          </button>

        </div>

      </main>
    </div>
  );
};

export default Compte;
