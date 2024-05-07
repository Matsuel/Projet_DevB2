import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from "@/Components/Header";
import styles from '@/styles/Compte.module.css';
import { useForm, SubmitHandler } from "react-hook-form"
import { deleteAccount, editAccount, editAutoEcoleInfos, editAutoEcolePersonnelFormations, editNotifications } from '@/Functions/Compte';
import { AccountInputs, NotificationsInputs, UserInfos, AutoEcoleInfosInputs } from '@/types/Compte';
import { useRouter } from 'next/router';
import { ReviewMonitor, ReviewsMonitor } from '@/types/Monitor';
import { ReviewAutoEcole } from '@/types/AutoEcole';
import { jwtDecode } from 'jwt-decode';
import { getToken } from '@/Functions/Token';
import { socket } from './_app';


const Compte: React.FC = () => {

  const router = useRouter()

  let token = getToken(router, jwtDecode)

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
  } = useForm<AutoEcoleInfosInputs>()

  const [editError, setEditError] = useState<boolean>(false)
  const [notificationsEdit, setNotificationsEdit] = useState<boolean>(false)
  const [formations, setFormations] = useState<string[]>([])
  const [students, setStudents] = useState<string[]>([])
  const [reviews, setReviews] = useState<ReviewAutoEcole[]>([])
  const [monitorsReviews, setMonitorsReviews] = useState<ReviewsMonitor[]>([])

  const [data, setData] = useState<UserInfos>()

  useEffect(() => {
    socket.emit('userInfos', { token: token })
    if (data && data.address) {
      // @ts-ignore
      setFormations(data.formations);
      // @ts-ignore
      setStudents(data.students);
      // @ts-ignore
      setReviews(data.reviews);
      // @ts-ignore
      setMonitorsReviews(data.reviewsMonitors)
    }
  }, []);

  socket.on('userInfos', (data: any) => {
    setData(data)
  })
  

  socket.on('editAccount', (data: any) => {
    console.log(data)
    data.edited ? (
      localStorage.setItem('token', data.token),
      window.location.reload()
    ) : setEditError(true)
  });

  socket.on('editNotifications', (data: any) => {
    data.edited ? setNotificationsEdit(true) : setNotificationsEdit(false)
    setTimeout(() => {
      setNotificationsEdit(false)
    }, 3000)
  });

  socket.on('editAEInfos', (data: any) => {
    data.edited ? window.location.reload() : console.log("error")
  });

  socket.on('editAutoEcolePersonnelFormations', (data: any) => {
    console.log(data)
    data.edited ? window.location.reload() : console.log("error")
  })

  socket.on('deleteAccount', (data: any) => {
    if (data.deleted) {
      localStorage.removeItem('token')
      router.push('/login')
    } else {
      console.log("error")
    }
  })

  if (!data) return <div>Chargement...</div>

  const onSubmit: SubmitHandler<AccountInputs> = async (infos) => {
    if (infos.newPassword !== infos.newPasswordConfirm) {
      setEditError(true)
      return
    }
    await editAccount(data._id, infos)
  }

  const onSubmitNotifications: SubmitHandler<NotificationsInputs> = async infos => {
    await editNotifications(data._id, infos)
  }

  const onSubmitInfos: SubmitHandler<AutoEcoleInfosInputs> = async infos => {
    await editAutoEcoleInfos(data._id, infos)
  }

  const handleDeleteAccount = async () => {
    await deleteAccount(data._id)
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
          {data?.address &&
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
          }

          {data?.address ?
            <div>
              {/* Formations de l'auto-école */}
              <div>
                <p>Formations</p>
                {formations.map((formation: string, index: number) => {
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
                })}
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
              </div>




              <button
                onClick={() => editAutoEcolePersonnelFormations(data._id, { formations, students })}
              >
                Modifier les formations, moniteurs et élèves
              </button>
            </div>
            : null}

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

          <button
            onClick={() => handleDeleteAccount()}
          >
            Supprimer le compte
          </button>

        </div>

        {
          data?.address &&
          <div>
            {reviews.length > 0 && <h2>Commentaires</h2>}
            {reviews.map((review: ReviewAutoEcole) => {
              return (
                <div>
                  <p>{review.comment}</p>
                  <p>{review.rate}</p>
                </div>
              )
            })}
          </div>
        }


        {
          data?.address &&
          <div>
            {monitorsReviews.map((monitor: ReviewsMonitor) => {
              return (
                <div>
                  {/* @ts-ignore */}
                  <h2>{monitor.monitor}</h2>
                  {monitor.reviews.map((review: ReviewMonitor) => {
                    return (
                      <div>
                        <p>{review.comment}</p>
                        <p>{review.stars}</p>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        }

      </main>
    </div>
  );
};

export default Compte;
