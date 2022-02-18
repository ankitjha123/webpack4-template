
require('./main.scss');
import React from 'react';
import ReactDOM from 'react-dom';
import styles from './subclass.module.scss';

console.log(process.env.NODE_ENV);

ReactDOM.render(
    <div className={styles.textStyle}> hello </div>
,document.getElementById('root'));