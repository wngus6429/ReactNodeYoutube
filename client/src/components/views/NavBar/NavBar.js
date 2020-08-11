import React from 'react'
import { Link, withRouter } from "react-router-dom";
//import Auth from "../../../hoc/auth";
import Axios from "axios";
import styled from "styled-components";

const Header = styled.header`
  color: white; /*기본 블랙이라 이걸 적어줘야 보임 */
  font-size: 20px;
  position: fixed; /* 스크롤 내려도 그 위치에 있음 */
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  display: flex;
  background-color: rgba(20, 20, 20, 0.8);
  z-index: 10; /*어느객체가 앞으로 나오고 뒤에 나올지 배치 순서를 결정하는 속성 */
  /*z-index는 position(relative, absolute, fixed)속성이 적용된 요소에서만 작동함 */
  box-shadow: 0px 1px 5px 2px rgba(0, 0, 0, 0.8);
`;

const List = styled.ul`
  display: flex;
  /* &:hover {
    background-color: blue;
  } */
`;

const SLink = styled(Link)`
  /*이걸로 박스안에 글씨, 위치 및 속성 설정 */
  color: yellow;
  display:flex;
  height: 50px;
  margin-right:30px;
  display: flex; /*박스 클릭하면 글씨 클릭처럼 되게끔 및 아래 효과 적용을 위해*/
  align-items: center; /*세로 위치선정 */
  justify-content: center; /*가로 위치선정 */
`; //위에 import 이름 중복 방지를 위해 S를 붙임.



function NavBar(props) {
  const onClickHandler = () => {
    Axios.get("/api/users/logout").then((response) => {
      //console.log(response.data);
      if (response.data.success) {
        props.history.push("/login"); //history는 react-router-dom 의 withRouter를 사용한다.
      } else {
        alert("Logout Fail");
      }
    });
  };

  return (
  <Header>
    <List>
        <SLink exact to="/" >Main</SLink>
        <SLink exact to="/video/upload">Upload</SLink>
        <SLink exact to="/subscription">Subscribe</SLink>
        <SLink exact to="/login">Login</SLink>
        <SLink onClick={onClickHandler} exact to="/logout">Logout</SLink>
        <SLink exact to="/register">Register</SLink>
    </List>
  </Header>
  )
}

export default withRouter(NavBar);