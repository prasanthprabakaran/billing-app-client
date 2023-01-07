import React from 'react';
import styles from './Home.module.css';

const Home = () => {
  return (
    <div>
      <section className={styles.hero}>
        <h1>Better way to manage your Business</h1>
        <div className={styles.paragraph}>
          <p>
            Invoicing application made with MongoDB, Express, React & Nodejs
          </p>
        </div>
        <br/>
        <br/>
        <br/>
        <br/>
        <div className={styles.imgContainer}>
          <img
            src='https://i.postimg.cc/G3DrfJS1/bill.png'
            alt='invoicing-app'
          />
        </div>
      </section>
    </div>
  );
};

export default Home;
