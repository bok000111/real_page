import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import { RootState } from '@/reducers';
import { setUser } from '@/reducers/authReducer';

type Setter<T> = (param: T) => void;

export default function Register() {
  const [errors, setErrors] = useState<[string, [string]][]>([]);
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    if (user !== undefined) router.replace('/');
  }, [user]);

  function formSubmitHandler(data: {}) {
    const url = 'https://api.realworld.io/api/users';
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    axios
      .post(url, data, {
        headers: headers,
      })
      .then((response) => {
        console.log(
          response.data.user.token.split('.').map((s: string) => {
            btoa(s);
          })
        );
        dispatch(setUser(response.data.user));
      })
      .catch((error) => {
        if (error.response) {
          setErrors(Object.entries(error.response.data.errors));
        } else {
          setErrors([['Connection', ['is unstable']]]);
        }
      });
  }

  return (
    <div className='auth-page'>
      <div className='container page'>
        <div className='row'>
          <div className='col-md-6 offset-md-3 col-xs-12'>
            <h1 className='text-xs-center'>Sign up</h1>
            <p className='text-xs-center'>
              <Link href='/login'>Have an account?</Link>
            </p>
            <TakenError errors={errors} />
            <SignInForm handler={formSubmitHandler} />
          </div>
        </div>
      </div>
    </div>
  );
}

function TakenError({ errors }: { errors: [string, [string]][] }) {
  return (
    <div>
      {errors.map((error, i) => {
        return (
          <div key={i}>
            {error[1].map((msg, i) => {
              return (
                <ul className='error-messages' key={i}>
                  <li>{`${error[0]} ${msg}`}</li>
                </ul>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function SignInForm({ handler }: { handler: (data: {}) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  return (
    <form>
      <FormTextInput placeholder='Your Name' setter={setName} />
      <FormTextInput placeholder='Email' setter={setEmail} />
      <FormPassInput placeholder='Password' setter={setPass} />
      <button
        type='submit'
        className='btn btn-lg btn-primary pull-xs-right'
        onClick={(e) => {
          e.preventDefault();
          handler({
            user: {
              username: name,
              email: email,
              password: pass,
            },
          });
        }}>
        Sign up
      </button>
    </form>
  );
}

function FormTextInput({
  placeholder,
  setter,
}: {
  placeholder: string;
  setter: Setter<string>;
}) {
  return (
    <fieldset className='form-group'>
      <input
        className='form-control form-control-lg'
        type='text'
        placeholder={placeholder}
        onChange={(e) => setter(e.target.value)}
      />
    </fieldset>
  );
}

function FormPassInput({
  placeholder,
  setter,
}: {
  placeholder: string;
  setter: Setter<string>;
}) {
  return (
    <fieldset className='form-group'>
      <input
        className='form-control form-control-lg'
        type='password'
        placeholder={placeholder}
        onChange={(e) => setter(e.target.value)}
      />
    </fieldset>
  );
}
