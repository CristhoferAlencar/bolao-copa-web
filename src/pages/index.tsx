import Image from 'next/image'
import appNlwCopaPreview from '../assets/app-nlw-copa-preview.png'
import logo from '../assets/logo.svg'
import usersAvatarExample from '../assets/users-avatar-example.png'
import iconCheck from '../assets/icon-check.svg'
import { api } from '../lib/axios'
import { FormEvent, useState } from 'react'
import { GetStaticProps } from 'next'

interface HomePros {
  pollCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home(props: HomePros) {
  const [pollTitle, setPollTitle] = useState('');

  const createPoll = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const response = await api.post('polls', {
        title: pollTitle
      });

      const { code } = response.data

      await navigator.clipboard.writeText(code);

      alert('Bolão criado com sucesso! O código foi copiado para área de transferência.');

      setPollTitle('');
    } catch (error) {
      console.log(error);
      alert('Falha ao criar o bolão, tente novamente');
    }
  }

  return (
    <div className='max-w-[1124px] mx-auto h-screen grid grid-cols-2 gap-28 items-center'>
      <main>
        <Image src={logo} alt="Logo NLW" quality={100} />

        <h1 className='mt-14 text-white text-5xl font-bold leading-tight'>Crie seu próprio bolão da copa e compartilhe entre amigos!</h1>

        <div className='mt-10 flex items-center gap-2'>
          <Image src={usersAvatarExample} alt="Logo NLW" quality={100} />
          <strong className='text-gray-100 text-xl'>
            <span className='text-ignite-500'>+{props.userCount}</span> pessoas já estão usando
          </strong>
        </div>

        <form className='mt-10 flex gap-2' onSubmit={createPoll}>
          <input className='flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100' type="text" placeholder='Qual nome do seu bolão?' required onChange={event => setPollTitle(event.target.value)} value={pollTitle} />
          <button className='bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700' type="submit">Criar meu bolão</button>
        </form>

        <p className='mt-4 text-sm text-gray-300 leading-relaxed'>Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas</p>

        <div className='mt-10 pt-10 border-t border-gray-600 flex justify-between text-gray-100'>
          <div className='flex items-center gap-6'>
            <Image src={iconCheck} alt="" quality={100} />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.pollCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className='w-px h-14 bg-gray-600' />

          <div className='flex items-center gap-6'>
            <Image src={iconCheck} alt="" quality={100} />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.guessCount}</span>
              <span>Palpites criados</span>
            </div>
          </div>
        </div>
      </main>

      <Image src={appNlwCopaPreview} alt="Dois celulares" quality={100} />
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const [pollCountResponse, guessCountResponse, userCountResponse] = await Promise.all([
    api.get('polls/count'),
    api.get('guesses/count'),
    api.get('users/count'),
  ]);

  return {
    props: {
      pollCount: pollCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },

    revalidate: 5 * 60
  }
}