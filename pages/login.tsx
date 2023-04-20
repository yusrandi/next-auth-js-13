/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router';
import React, { useContext, useRef, useState } from 'react';
import AppConfig from '../layout/AppConfig';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Page } from '../types/types';
import { Toast } from "primereact/toast";



import { useSession, signIn, signOut } from "next-auth/react"

const LoginPage: Page = () => {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [checked, setChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);

    const router = useRouter();
    const toast = useRef<Toast>(null);

    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    async function handleSignInGoogle() {
        signIn('google', { callbackUrl: "http://localhost:3000/" })
    }
    async function handleSignInGithub() {
        signIn('github', { callbackUrl: "http://localhost:3000/" })
    }
    async function handleSignInCredential(values: any) {
        values.preventDefault()
        console.log(values);

        const status = await signIn('credentials', {
            redirect: false,
            email: email,
            password: password,
            callbackUrl: "/"
        })
        console.log(status);
        if (status?.status == 200) {
            toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });

            router.push("/");
        } else {
            toast.current?.show({ severity: 'error', summary: 'Failed', detail: status?.error, life: 3000 });
        }


    }
    return (
        <div>
            <div className={containerClassName}>
                <div className="flex flex-column align-items-center justify-content-center">
                    <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
                    <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)' }}>
                        <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                            <div className="text-center mb-5">
                                <img src="/demo/images/login/avatar.png" alt="Image" height="50" className="mb-3" />
                                <div className="text-900 text-3xl font-medium mb-3">Welcome, Isabel!</div>
                                <span className="text-600 font-medium">Sign in to continue</span>
                            </div>

                            <form method="post" onSubmit={(e) => handleSignInCredential(e)}>
                                <div>
                                    <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                        Email
                                    </label>
                                    <InputText value={email} onChange={(e) => setEmail(e.target.value)} id="email1" type="text" placeholder="Email address" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />

                                    <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                        Password
                                    </label>
                                    <Password value={password} onChange={(e) => setPassword(e.target.value)} inputId="password1" placeholder="********" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem"></Password>

                                    <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                        <div className="flex align-items-center">
                                            <Checkbox inputId="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked ?? false)} className="mr-2"></Checkbox>
                                            <label htmlFor="rememberme1">Remember me</label>
                                        </div>
                                        <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                            Forgot password?
                                        </a>
                                    </div>
                                    <Button type='submit' label="Sign In" className="w-full p-3 text-xl" ></Button>


                                </div>
                            </form>

                            <div className='flex mt-3 align-items-center justify-content-center gap-2'>
                                <Button icon="pi pi-google" severity="success" className=" mr-2" onClick={handleSignInGoogle} />
                                <Button icon="pi pi-github" severity="danger" className=" mr-2" onClick={handleSignInGithub} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

LoginPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple />
        </React.Fragment>
    );
};
export default LoginPage;
