import styles from '../styles/index.module.scss';
import { Bricolage_Grotesque } from 'next/font/google';
import background from '../assets/images/loginBackground.png';
import Image from 'next/image';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useRouter } from 'next/navigation';
import SignInForm from './signInForm';

const defaultFont = Bricolage_Grotesque({
  subsets: ['latin'],
  display: "swap",
});

const Login = (): JSX.Element => {
    const { push } = useRouter();

    return (
      <div id={styles.rootContainer} className={defaultFont.className}>
        <div id={styles.formContainer}>
          <div id={styles.userForm}>
            <div id={styles.caption}>JustDo</div>
            <Tabs 
              className={styles.reactTabs} 
              selectedTabClassName={styles.reactTabsTabSelected}
              selectedTabPanelClassName={styles.reactTabsTabPanelSelected}
            >
              <TabList className={styles.reactTabsTabList}>
                <Tab className={styles.reactTabsTab}>Sign in</Tab>
                <Tab className={styles.reactTabsTab}>Sign up</Tab>
              </TabList> 

              <TabPanel className={styles.reactTabsTabPanel}>
                <SignInForm onSignIn={() => push('/todo')} />
              </TabPanel>
              <TabPanel className={styles.reactTabsTabPanel}>2</TabPanel>
            </Tabs>
          </div>
        </div>
        <Image id={styles.backgroundPicture} src={background} alt='Image' />
      </div>
    );
  };
  
  export default Login;