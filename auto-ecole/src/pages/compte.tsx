import React, { useState } from 'react';
import Head from 'next/head';
import Header from "@/Components/Header";
import styles from '@/styles/Compte.module.css';
import useSWR from 'swr';
import axios from 'axios';
import { useForm, SubmitHandler } from "react-hook-form"
import { deleteAccount, editAccount, editAutoEcoleInfos, editNotifications } from '@/Functions/Compte';
import { AccountInputs, NotificationsInputs, UserInfos, AutoEcoleInfosInputs } from '@/types/Compte';
import { useRouter } from 'next/router';
import { Monitor } from '@/types/Monitor';

const fetcher = (url: string) => axios.get(url).then(res => res.data)



const Compte: React.FC = () => {

  const router = useRouter()

  let token = ""

  if (typeof window !== 'undefined') {
    if (!localStorage.getItem('token')) {
      router.push('/')
    } else {
      token = localStorage.getItem('token') as string
    }
  }

  const {
    register,
    handleSubmit
  } = useForm<AccountInputs>()

  const {
    register: registerNotifications,
    handleSubmit: handleSubmitNotifications,
  } = useForm<NotificationsInputs>()

  const {
    register: registerAutoEcoleInfos,
    handleSubmit: handleSubmitInfos,
    watch: watchAutoEcoleInfos
  } = useForm<AutoEcoleInfosInputs>()

  const [editError, setEditError] = useState<boolean>(false)
  const [notificationsEdit, setNotificationsEdit] = useState<boolean>(false)

  const { data, error, isLoading } = useSWR<UserInfos | any>('http://localhost:3500/userInfos?token=' + token, fetcher)
  if (isLoading || !data) return <div>Chargement...</div>
  if (error) return <div>Erreur</div>

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

  const onSubmitInfos: SubmitHandler<AutoEcoleInfosInputs> = async infos => {
    const response = await editAutoEcoleInfos(data._id, infos)
    if (response.edited) {
      window.location.reload()
    }
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

        {/* Infos de base du compte */}
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

          {/* Infos de l'auto-école */}
          <form onSubmit={handleSubmitInfos(onSubmitInfos)}>
            <div>
              {data?.address &&
                Object.entries(data).filter(([key, value]) => typeof value === 'boolean').map(([key, value]) => {

                  return (
                    <>
                      <label htmlFor={key}>{key}</label>
                      <input
                        type="checkbox"
                        id={key}
                        defaultChecked={value as boolean}
                        {...registerAutoEcoleInfos(key.toString() as keyof AutoEcoleInfosInputs)}
                      />
                    </>
                  )
                })
              }

              {data?.address &&
                Object.entries(data).filter(([key, value]) => typeof value !== 'boolean' && typeof value === "string" && key.toString() !== "_id" && key !== "email" || key === "zip").map(([key, value]) => {
                  return (
                    <>
                      <label htmlFor={key}>{key}</label>
                      <input
                        type="text"
                        id={key}
                        defaultValue={value as string}
                        {...registerAutoEcoleInfos(key.toString() as keyof AutoEcoleInfosInputs)}
                      />
                    </>
                  )
                })
              }

              <button
                type="submit"
              >
                Modifier les informations de votre auto-école
              </button>
            </div>
            <div>

            </div>

            {/* Formations de l'auto-école */}
            <div>
              {data?.address &&
                Object.entries(data).filter(([key, value]) => key === "formations").map(([key, value]) => {
                  return (
                    <>
                      <p>Formations</p>
                      {(value as string[]).map((formation: string) => {
                        return (
                          <div>
                            <p>{formation}</p>
                          </div>
                        )
                      })}
                      <input
                        type="text"
                        id="newFormation"
                      />
                    </>
                  )
                })
              }
            </div>

            {/* Moniteurs de l'auto-école */}
            <div>
              {data?.address &&
                Object.entries(data).filter(([key, value]) => key === "monitors").map(([key, value]) => {
                  return (
                    <>
                      <p>Moniteurs</p>
                      {(value as Monitor[]).map((monitor: Monitor) => {
                        return (
                          <div key={monitor._id}>
                            <p>{monitor.name}</p>
                          </div>
                        )
                      })}
                      <input
                        type="text"
                        id="newMonitor"
                      />
                    </>
                  )
                })
              }
            </div>

            <div>
              {data?.address &&
                Object.entries(data).filter(([key, value]) => key === "students").map(([key, value]) => {
                  return (
                    <>
                      <p>Elèves</p>
                      {(value as string[]).map((student: string) => {
                        return (
                          <div>
                            <p>{student}</p>
                          </div>
                        )
                      })}
                      <input
                        type="text"
                        id="newStudent"
                      />
                    </>
                  )
                })
              }
            </div>


          </form>

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
