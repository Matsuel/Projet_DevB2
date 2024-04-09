import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from "@/Components/Header";
import styles from '@/styles/Compte.module.css';
import useSWR from 'swr';
import axios from 'axios';
import { useForm, SubmitHandler } from "react-hook-form"
import { deleteAccount, editAccount, editAutoEcoleInfos, editAutoEcolePersonnelFormations, editNotifications } from '@/Functions/Compte';
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
  const [formations, setFormations] = useState<string[]>([])
  const [students, setStudents] = useState<string[]>([])

  const { data, error, isLoading } = useSWR<UserInfos | any>('http://localhost:3500/userInfos?token=' + token, fetcher)
  useEffect(() => {
    if (data && data.address) {
      setFormations(data.formations);
      setStudents(data.students);
    }
  }, [data]);
  if (isLoading || !data) return <div>Chargement...</div>
  if (error) return <div>Erreur</div>

  // {data && data.address &&  setFormations(data.formations)}


  const onSubmit: SubmitHandler<AccountInputs> = async (infos) => {
    if (infos.newPassword !== infos.newPasswordConfirm) {
      setEditError(true)
      return
    }
    const response = await editAccount(data._id, infos)
    response.edited ? localStorage.setItem('token', response.token) : setEditError(true)
    window.location.reload()
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

  const addFormation = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setFormations([...formations, e.currentTarget.value])
      e.currentTarget.value = ""
    }
  }

  const deleteFormation = (index: number) => {
    const newFormations = [...formations]
    newFormations.splice(index, 1)
    setFormations(newFormations)
  }

  const addStudent = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setStudents([...students, e.currentTarget.value])
      e.currentTarget.value = ""
    }
  }

  const deleteStudent = (index: number) => {
    const newStudents = [...students]
    newStudents.splice(index, 1)
    setStudents(newStudents)
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
          </form>

          {/* Formations de l'auto-école */}
          <div>
            <p>Formations</p>
            {data?.address &&
              formations.map((formation: string, index: number) => {
                return (
                  <>
                    <p key={index}>{formation}</p>
                    <button
                      onClick={() => deleteFormation(index)}
                    >
                      Supprimer
                    </button>
                  </>
                )
              })
            }
            <input
              type="text"
              id="newFormation"
              onKeyDown={(e) => {
                e.key === "Enter" && addFormation(e)
              }}
            />
          </div>

          {/* Elèves de l'auto-école */}
          <div>
            {data?.address &&
              <>
                <p>Elèves</p>
                {students.map((student: string) => {
                  return (
                    <div>
                      <p>{student}</p>
                      <button
                        onClick={() => deleteStudent(students.indexOf(student))}
                      >
                        Supprimer
                      </button>
                    </div>
                  )
                })}
                <input
                  type="email"
                  id="newStudent"
                  onKeyDown={(e) => {
                    e.key === "Enter" && addStudent(e)
                  }}
                />
              </>
            }
          </div>

          <button
            onClick={() =>  editAutoEcolePersonnelFormations(data._id, {formations, students})}
          >
            Modifier les formations, moniteurs et élèves
          </button>




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
