import * as styles from './SignIn.module.scss';
// import * as styles from '../styles/login.module.scss';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { userMicroserviceAxios } from '@packages/shared/axiosInstances/userMicroserviceAxios';

interface ISignInFormData {
  email: string,
  password: string,
  deviceId: string;
}

export interface ISignInFormProps {
  onSignIn: () => void
}

const SignInForm = ({onSignIn}: ISignInFormProps): JSX.Element => {
      const [deviceId, setDeviceId] = useState<string>('');

      useEffect(() => {
        var oldDeviceId: string | null = window.localStorage.getItem('deviceId');
        if (!oldDeviceId){
          var newDeviceId: string = '';
          const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
          for (let i = 0; i < 20; i++) {
            newDeviceId += characters.charAt(Math.floor(Math.random()*characters.length));
          }
          window.localStorage.setItem('deviceId', newDeviceId);
          setDeviceId(newDeviceId);
        }
        else{
          setDeviceId(oldDeviceId)
        }
      }, [])

      const signIn = useFormik({
        initialValues: {
            email: '',
            password: '',
            deviceId: ''
        },
        onSubmit: async (values: ISignInFormData) => {
          values.deviceId = deviceId;
          var response = await userMicroserviceAxios.post('login', values);
          if (response.status === 200){
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            onSignIn();
          }
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .required('Email is required')
                .email('Not valid email')
                .max(40, 'Too long email'),
            password: Yup.string()
                .required('Password is required')
                .min(4, 'Password too short')
                .max(20, 'Password too long'),
        })
    })

    return (
      <form onSubmit={signIn.handleSubmit}>
        <div className={styles.formInput}>
            <div className={styles.formInput}>
                <input
                    id="email"
                    name="email"
                    type="text"
                    placeholder="Email"
                    onChange={e => {
                        // setinvalidUserError(false)
                        // setPasswordError(false)
                        signIn.handleChange(e)
                    }}
                    value={signIn.values.email}
                    readOnly
                    onFocus={(e) => e.target.removeAttribute('readonly')}
                />
            </div>

            {signIn.touched.email && signIn.errors.email && (
                <small>{signIn.errors.email}</small>
            )}
        </div>
              
        <div className={styles.formInput}>
            <div className={styles.formInput}>
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Pasword"
                    onChange={e => {
                        // setPasswordError(false)
                        signIn.handleChange(e)
                    }}
                    value={signIn.values.password}
                    readOnly
                    onFocus={(e) => e.target.removeAttribute('readonly')}
                />
            </div>
            <div>
                {signIn.touched.password && signIn.errors.password && (
                    <small>{signIn.errors.password}</small>
                )}
            </div>
        </div>

        <div>
            <button className={styles.btnSubmit} type="submit">
                Sign in
            </button>
        </div>
      </form>
    );
  };
  
  export default SignInForm;