import * as styles from '../styles/login.module.scss';
import background from '../assets/images/loginBackground.png';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import SignInForm from '../components/SignInForm';
import { useNavigate } from 'react-router-dom';

const Login = (): JSX.Element => {
    const navigate = useNavigate();

    return (
      <div id={styles.rootContainer}>
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
                <SignInForm onSignIn={() => navigate('/todo')} />
              </TabPanel>
              <TabPanel className={styles.reactTabsTabPanel}>2</TabPanel>
            </Tabs>
          </div>
        </div>
        <img id={styles.backgroundPicture} src={background} alt='Image' />
      </div>
    );
  };
  
  export default Login;