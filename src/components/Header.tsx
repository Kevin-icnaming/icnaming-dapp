import React, { useState, useEffect } from 'react'
import styles from '../assets/styles/Header.module.scss'
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { ConnectWallets } from "./ConnectWallets";
import { useAuthWallet } from "../context/AuthWallet";
import { formatAddress } from '../utils/helper';
import { deleteCache } from 'utils/localCache';

export const Header = () => {
  const history = useHistory();
  const { ...authWallet } = useAuthWallet();
  const [showWallets, setShowWallets] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentPcIndex, setCurrentPcIndex] = useState(0)

  const houdleNav = (index) => {
    if (index === 'logo') {
      setCurrentIndex(0)
      setMenuVisible(false)
      return false
    }
    if (index !== null) {
      setCurrentIndex(index)
    }
    setMenuVisible(!menuVisible)
  }

  const houdlePcNav = (index) => {
    if (index === 'logo') {
      setCurrentPcIndex(0)
      return false
    }
    if (index !== null) {
      setCurrentPcIndex(index)
    }
  }

  const logout = async () => {
    authWallet.quitWallet();
    history.push('/');
    setCurrentPcIndex(0)
    setCurrentIndex(0)
    localStorage.removeItem('myFavoriteNames');
    localStorage.removeItem('myQuotas');
    sessionStorage.removeItem("connectStatus");
    sessionStorage.removeItem("walletType");
    sessionStorage.removeItem("orderInfo");
    deleteCache('getNamesOfRegistrant' + authWallet.walletAddress)
    deleteCache('namesOfController' + authWallet.walletAddress)
  }

  const HeaderWallet = () => {
    return (<div className={`${styles['wallet-wrap']} appheader-wallet-wrap`}>
      {
        authWallet.isAuthWalletConnected ?
          <div className={styles.wallet}>
            <i className="bi bi-person"></i>
            <span className={styles.address}>{formatAddress(authWallet.walletAddress)}</span>
            <i className="bi bi-box-arrow-right" onClick={() => {
              logout()
            }}></i>
          </div>
          :
          <button className={styles['btn-wallet']} onClick={() => { setShowWallets(true) }}>
            <span>Connect Wallet</span>
          </button>
      }
    </div>)
  }
  const [navitems, setNavitems] = useState<any>([
    { title: 'Home', path: '/' },
    { title: 'FAQ', path: '/faq' },
  ])
  useEffect(() => {
    if (authWallet.isAuthWalletConnected) {
      setNavitems([
        { title: 'Home', path: '/' },
        { title: 'My Account', path: '/myaccount' },
        { title: 'Favourites', path: '/favourites' },
        { title: 'FAQ', path: '/faq' },
      ])
    } else {
      setNavitems([
        { title: 'Home', path: '/' },
        { title: 'FAQ', path: '/faq' },
      ])
    }
  }, [authWallet.isAuthWalletConnected])

 
  return (
    <header className={`${styles.header} app-header`}>
      <div className={`${styles.navbar} container-xxl flex-wrap flex-md-nowrap`}>
        <span onClick={
          () => {
            history.push('/')
            houdlePcNav('logo')
          }
        } className={`${styles['header-logo']} headerLogo`}>logo
        </span>

        <button className="navbar-toggler" type="button" onClick={() => { houdleNav(null) }}>
          <i className="bi bi-list"></i>
        </button>

        <div className={styles['navbar-collapse']}>
          <ul className={`${styles['navbar-nav']} ms-md-auto ms-sm-auto`}>
            {
              navitems.map((item, index) => {
                
                  return <li key={index} className={`${styles['nav-item']} ${index === currentPcIndex ? styles.current : null}`}>
                    <span className={styles['nav-link']} onClick={() => { history.push(item.path); houdlePcNav(index) }}>{item.title}</span>
                  </li>
                
              })
            }
            <li className={styles['nav-item']}>
              <a className={styles['nav-link']} target="_blank" rel="noreferrer" href='https://docs.icnaming.com/'>Docs</a>
            </li>
          </ul>
          <HeaderWallet />
          <div className={styles['language']}>
            <button className={styles['btn-language']}>EN <i className="bi bi-chevron-down"></i></button>
          </div>
        </div>
      </div>

      <div className={`${styles['sm-nav']} ${menuVisible ? styles.show : styles.close}`}>
        <div className={styles['sm-nav-inner']}>
          <div className={styles['sm-nav-header']}>
            <div className={styles['sm-nav-logo']}></div>
            <button className={styles['sm-nav-toggler']} onClick={() => { houdleNav(null) }}><i className="bi bi-x"></i></button>
          </div>
          <div className={styles['sm-nav-bd']}>
            <HeaderWallet />
            <div className={styles['language']}>
              <button className={styles['btn-language']}>EN</button>
            </div>
          </div>
          <ul className={styles['sm-nav-list']}>
            {
              navitems.map((item, index) => {
                return <li key={index} className={`${styles['sm-nav-item']} ${index === currentIndex ? styles.current : null}`}>
                  <Link className={styles['nav-item-link']} to={item.path} onClick={() => { houdleNav(index) }}>{item.title}</Link>
                </li>
              })
            }
          </ul>
        </div>
      </div>
      <ConnectWallets visible={showWallets} hide={() => { setShowWallets(false) }} />
    </header>
  )
}




