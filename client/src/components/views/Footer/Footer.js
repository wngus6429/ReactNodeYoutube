/** @format */

import React from 'react'
import {SmileTwoTone} from '@ant-design/icons';

function Footer() {
    return (
        <div style={{
            height: '40px', display: 'flex',
            justifyContent: 'center', fontSize:'20px',
            backgroundColor: "rgba(20, 20, 20, 0.8)"
        }}>
           <p style={{ color:'yellow' ,alignItems:'center'}}> Happy Music  <SmileTwoTone style={{fontSize:'20px'}}/></p>
        </div>
    )
}

export default Footer