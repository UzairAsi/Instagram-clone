import React, { useEffect, useState } from 'react';
import './App.css';
import Post from './Post';
import {auth, db} from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import Imageupload from './Imageupload';
import InstagramEmbed from 'react-instagram-embed'

function getModalStyle() {
  const top = 35;
  const left = 35;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `tranlate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts,setPosts] = useState([]);
  const [open,setOpen] = useState(false);
  const [openSignIn,setOpenSignIn] = useState(false);
  const [username,setUsername] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [user,setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    })
    
    return () => {
      unsubscribe();
    }
  }, [user, username]);

  useEffect(()=>{
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot  => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id, 
        post: doc.data()})))
    })
  },[])

  const signUp = (event)=> {
    event.preventDefault();

    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser)=>{
      return authUser.user.updateProfile({
        displayName: username,
      })
    })
    .catch((error) => alert(error.message));

    setOpen(false);
  }
  
  const signIn = (event) =>{
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message))
    setOpenSignIn(false);

  }
  return (
    <div className="App">

      <Modal
        open={open}
        onClose={()=> setOpen(false)}
      >
       <div style={modalStyle} className={classes.paper}>
       <form className="app__signup">
       <center>
          <img
            className="app_headerImage"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWwAAACKCAMAAAC5K4CgAAAAilBMVEX///8AAADw8PANDQ2AgID8/PxKSkr4+Pji4uLS0tL09PQbGxtERETX19f5+fmwsLDIyMjo6OhTU1Pf39+5ublsbGxmZmZ7e3vCwsKxsbF1dXWpqakiIiKcnJyjo6POzs6JiYmUlJQ7OzseHh42NjYrKytnZ2dYWFgvLy+GhoYWFhYLCwuPj49eXl6KJqLXAAATgElEQVR4nO1d13riOhCm2XSCDQRCNz2U93+9g8o02ZRlzdkvu5qr4BiVX9M1EoWCJ0+ePHny5MmTJ0+ePHny5MmTJ0+ePHny5MnTK9T7DlvD2Ue/266V/vRY/nKqfheRTsdmq51Xw91+Pcqrrb+ESvuipFY1p4bLxeI2roy8sCBVQwfrYpgT2HXb3iHp5NPgz6eBi3WxklPLH9hiklOLP53mKayL3zk1PfNgS6of02APc2r7jC3Oc2rxh9MljXUxzknFkpPzlU+DP5z6GVgXyzm5D0NssZtPgz+ctgaM1aw/2ecO9hhbrOfT4M+mL4PFUvl6wWfeYJOfU8unwR9NnZB7H4u8wd5Bgycf1hQKIw3FxsYwKuDLFWwUlWM+7f1sMmj07adG3mCjp7PNp70fTe2jQKKXsxoJ0OSGubT3synRSGB0188b7Bga/MylvZ9NLY3EAj4ucwa7gxmuvJItP5jaxjw24HMlZ7BLK2hwlkt7P5oSR8TzBrvWhAY/cmnvR1PL4bqcwG5EtXa7Xq+3KZ84LP3zCW0DxAg/5wJ2d9CaHk9Fh7b7wXg4HFa+z/PuPxlN2oCR0hZ5gB25MGfQJ+xx1ufDz8H3/HHiJOh1fy+7Ek2+d7vhbPTHBMyk9tfEaHmAXTo8gXZZo91GZ2XVD+61GZ2P+qXGvZfuNoAZsdPkDyUOzAg21HsuamS0fQJt5dpP+IOwH93Euw8trj6izM3R6gN+7XIG2Mx7Oe2w/grZkKNF/JKPgYxmcTbe68Mq3A+Gy+WlPHGwvtL2kmRXPfAXt/vvrjO2Un8c7xeZ37RUL8ueTvF3brUaz1J1qruOaZ1zc/1K9a9ksOYTHMz7dWLLqFPoZqxGM0svp15sDnvs3xM9i8O9wUwzuvq/t+kaxcdgL75Gvbvq9B7VqEQihWKQAUAxa0OnlPXaGPUGsP1t7qAs/V20S/XeyybhCXoC7NpVAE+byvNCFzSuLnYb1C+G/9OUt3dOT19RKwXaOPO9GN6DjbfbYGfu+12pJ96K1sXTejX+ep217pMFO7yjs6HI5qkAsFr7quxXSma38SQQ7R1cbXzTQZw4L7ZvvAfJFthSvmnzOvGNFmQFAcy0/KYsjgV7dccbga2b1uPW2ktRV6XHjPu9K1dCk1tgu7lYVkAUThZd2kG2islKSPnmuEa3etoKBsDs8hNTfYUs2FPqNAX26MkRBJONOxflHyBSoSOcJfb6dNaO6qhV1lIGehSKGulCc2k5cPYIbF7GuFxEvTmaS6EcUdTuZd6D0m3/9AFZsE/UaQps0Hf3wQ7mGfZe6QM0TbHzDcZuA6MA2oCqNKUJvgemE/ItdkhgIHfzr9GiXUvZuBr11DKGowQSKEpZGo/BNl+MX6uAgfbJA3gN7HqmVlRbbchVF+crpBx28Mhu87NMzZUCzNGiLm/YhT2UxNc0naabeDwRlo+c9BbIDGgMURFXfQw21NKFr9TAVLfOPNJgQ2Ekgd1JxXA3rL2Sl1sbNRTSb0hrHGiRkNA8Xkh87SCt9stQyadvxt/k91HcYxX/UgzpIdgBxQ0vZOcDux07cOdBYANfINj9q7IdCz+OClUFrdSatODToCAISyY4tEkG2MiXjFv7AmxqihE5GsiwfK/IfkdUj6Z0dqfen/S5kHCmeqHw1LpNd3ZqXLDN5yYzLbeMvV58VAJOoSYWtzIfH0yfABt25/liWS1s1Ui9mEHkzVL4yRzxTgp+ptst2F2z77HC4QRCWQpl9xTBWqGApcAGVCzYwEZk7xrCC2ntxjFrIEBt4TivOG7uv9eMMub2pwoFtiL1YfsyigUMa5Nn0GltcFnHvIVVelDo+hmwI5zX2b4gV3VX+FXqOO2lwQaPzIBdQrWALgOv7f6sXxmqMz8hZAHmo86i3wASQ6JOqrpK4Q8IyMyHeba3r+j1COu9NtWCMyuE8adgRSMwQtzQOhiwyZ+H8qJKkdMLNdXWWyiD9UmBDX0asBPsCy0EY2zQY1fFMjXC10GPUJbCo36UdjN0gCLRW4r3zDPLqr0mrC0tLRUWNsDNW4sWxrwFQ6j7NdjMYWzaMctEpoz1nyJQuIBdCmxw0TTYPaqaB5RYlogEqwEjaSDY0nyjnpdZAAMMTxAl9j2ZQDXPrLDUtI8wEr3RUHBZBbCWh4Q/iso9pBc42NIPkM09SXbhIa5JgQ0GquWMAAwm8wUysqMl3FyXGQ/0MUS0aKPKHXtolcBGZJkisX5G06vOMSxhah8VrVxWI9ErPmRkAAU2+TAItowlft0+FljQYpgRDwoA2CCFClwmWqhEyRcJM/KTEYqCnCskA4VsB2AQ1ktoCk6xyZDILpU1ghpsnVQkKSPXFOZXFqE5TvMz/aYGm0dKBmy5/5BOYj5F4PMfk1oQdTGVBGCD76bA5klRgIk4O8ti9HCEwp/DQuI9f8jkFNQAZP2Fea2CixNPlAxosHUuDVVGk14GoykSYYxrKAnHwRYZcNNaojGGZ08eE23PzzOu3KOM00sMbGi+xaWUzYe4aZnVGbpjAuwA1lSYTWbtpw4q4ts8tlhaAxkrC48qY5du9HKrBdQkyMyhk/81U1UwhVht7sRo2WRZl9ubrN0pAhvQajlbhlj3ijY6y2SQayrgasCXhOZjudSL831h+pOieFEv6EBgyAwEsKhwqZmPSNYApxc6U9Vga3XZxyE+E65jhizroaCjHQR8btkc/NQqhhV8G3VLlhojJSNgjUC7CJvKsuGg4S0jlIUdZRJwWlj/WOsZdPlZnggyYcJAs3P6tAgcbAXqAcajwVa+QZMKoJ+wj2jNZIzwkapeujZswIao5wq2AW5m9QqGkDVUyxlKm6RGjA60w1qsD2Vpj8DJllelM8K2yRRDa+7XgnN2v14gH2J0owWSOGT3sBApqzAH9BXYDaVFZoV0THeTIgR1I//RxkaQpsagoJ5uGb+vVbJtUDSC24wZsvUA7AO3WmwDGA9h2vnGwhwxdaP4VTOB9jWA5be0Ng0w8BydgB38JJlhYKthnyJQ4gpsterHqIoR3OM9WVrQlH79cm8KsLkpyjvq1S6OSqkW2NBT1QHkGHKwI3Rx+K4Hc23R/FgAPvl73FNY2D5ONT4/1mwEnguXoQZNdkrFPQmBrVbtUuBgqwUeFkpga5oPPT/ywzJO21bbs8E+3GPiyN7KgGY51kwWduAB6rrqmW07uWgT2DzdjrIgtm961MwSnp0d8BV1WH+KLxUmRs8A2Mzz6Fnd1OSKiIrGee76TM+UoM/QFW3ayudFIQJNJ3Yvo6zKIrLB0+xt/041QOa3zIQI7LXymyD66PlerVJI3uNSloFlg41KS2RGmFeE+shaMiGIjC/1jrqa1kV3C/qFGY/EPhJan2U52AgQ7FgfmetxsJXpveoyTFccWHOLQzlj44YG6VYLEKFKsPPDVJhm+WMN1S16yFehvrDk40XEkZlg19ASCo5lQRuOr5JCr0DsdWWwwL5jUmDAKcx7xwCYD4u8f76MJG9q1McGB1tx2px5snzt9lnGiqKXO4UROBHLuTKHOyBWx/ZXij3alPs7cttB3MrAphUQHJtQPxjbDzMGzOpItHLe4xcgdcN4CeYs7qph+Ry2jOhR7tVfnwUGtlqdU8TQYMUfyjlO3+6Bbw5uh5oUD364aCn6oqkC2B2DRcQMPEuD0LQY2KTOBMdWMlrIAptJgNb5SifIxA65c7gwwp9he0vU8gItWrwy+BHYSsMovZoFtuoirSmgi/2dsJ6GUU+Nq6jtEQwfTCH0VWVYfWMPJLAMbFJnHGzuZCDYWWqEpR6VxlW+aNN0mKT6wnSLADuhFghsCnS0lI7oy2u9nmqSbVgQBvZHMSvEsQHC4V7xIPUYiC/ZLoK0GlFsaoJ/FojG0AepLgKApVi4GmlkBJAwHrEoLCZQOl/Jng2IYQTkU+PCCDXCHHVq2anGKBHYW83QyuVAA8nAVkNMbyT03ZGkifYT5f6upWWh4BpIFcODae4RDFuruGmnhhafl+ewviMWxqIHmeH6sQ0MDZVa7b5smaZIWTrOYs5yme5llZHaCkM1otJPG/ESM5BXnXNI6woDtlssk/GKIvDsxO1Rak6On60YHd2nKkn4uotDoe8aYokJPhhuihPn3R0Lavjyq0FcjcXaThYYAcGm5B331TiumON1al+UNRDVPxoQrHYhP1t1kZEC7AoUs4jyLCj1M94hT9BbnJRSZRESvb42ugUVMdqQKtvK4wWAvCcQblAtF+a981BXeXwbEgQYG0oRLcyRO8asBcxbOPe/VVywNSAdkAnKvkyKmVmp3kOwaXW3gELC+tMPq7YqyKRYVVDKmYYN0EwPndclvMFN7oqByGcLsgK+EFMCItOsGp0fEhgs7CrAwgY7epWpVb6ZWLYtu5X5k4Jk9rWZJPpc4N8qs56V7jS7HveKj4nnEBq+OWNEDhSDFiQlCkNR1kkj3AloUdcoUJsWFZYx0vuP240EF6KUJgXEooQeh2lpJx/zIwvMG9KmEKZhF8FNM3cLki1sYuGb/19RrXjjCoSYEMskylORlPC5zcRbV0XVsZOLuTUmF1Cpzhrab4ufVs1L2wjbGNRMPPhmX+XVwthBSWSDXTGFvJX9yA0O6Tq9BAcQQauCnNOEOjLj6sY6X4g/9Fwp3rhpTPe9vXkLLZMacoi4Ju3K1y5DtH5lFseQnKuHWPVftlZLawsspyFtp5+PYDJG/j5FU5rk2RAXbGtkbdZP7xav7OpQbZ6GeQmH6vcdC82Jl3FrkeNHHuzoMVVkOb3dzCjzN2/qfm8dkmKxImM4pt8su9fEETCgJXk/+Ewk9K2HoZfqgkyDaGnHb9uAW5N0LaESbQsV2Pu6/ozOX8oAma/z8lY4QYmOj1n+OqpfxfIqevzkmkRFFNw8AItiMGCSEkF8E1CTeF5nZ/xGbKeehfpsCWAFWQR3fQjcF4PEUMyiFwfZ49jAT33MXePmmlY+S1KK0/5C/dmyImCVu82NouZMgW3Vk5FBBUxcHUi4zHKvWI3DrD5Tq9dLq+gmfQZeQt5Ry1/Vk78RkJupZt4fzNUFd8jY6gJv8NPScYleOBtwMWIw4SFtLbQW9RkOAFasx9e0lDqGV4el03qlZuznFPtcutOwEqPVYKL+6qN/ZF2U2tY85n6uog+honfEAWwuAo/9vMLbTZP59z4VXdb5BaFT8e8MDwUPN65nV27t4/ofw2ElRhGHiDZdUTwiVOwsumsEVAQXX+QRJu1FYntKUHhSYENVbw04ODC7h1faBDR2zU685Ej1zT8P+dIVuawLuS7eO6bQMEw5TbhnWK0PeelIU7roZNHpebU/jMNw8GFaaWce6RyjtnL3N42EwPJOGo2evgQAttCZC4E7jIrQDTlEyF7pinS7tK3ZAMec4IgatYnhHRPOdmnayn3lFWdWP2GUQA6AI3rHO9kPdKZ2s25UulKvf5a7j+6uQwdcventy/QXFbfQZ8jG4JwMOBnBweh8C1oJUlsjG01vzEhcVroaJLQDGUGDeF3bVSy3nB4ccwt3QpS1KuAZLhjLl1FcIZu7iCvvHw/tpQ7QSWqlo6Fefz6bTRb3T6S1P86D1ra5PrQ+z5OF3BsTIT8mSdw7uynBEHxV4nAIV2I0nHRcHJDVHjdSbhe/494ew3GrkFgWqbu8hIO5/UxlAszDiOrdhcSEey0PjuJG2YeTDR3Pv3M1RKAp4x8J64LsiXSZ42wn6UoloaZONabXy+tp6N4e0kD7M4SV+BKR0PFWZTXbALkLIlq41eNDY6PU7xtYao7fdS3EBHzzJq9Cm9Amd/Fy5xKIzozEUVsUWSndcvRbMFEb0Mfwi9Z9waRjdVvLBvXZZ3iYblfD+1dSBIvzZxzvnrskZjRwrt/Qg5i98eKmaKksU3Mou6iO5slY/ePw4DqKxijZ6S38lkZK6qWMuoxet+uw72KSVNSSHZePECpFL5/hvUWL2TAGw3FsDc79t/+WTKl3o4ueC8wtWnwYplzIPH/qCoKbFP3mLVP/IDG+Dkcfs/t3S3n6HQr4mS1/5ehbqaqcKbQ4yz89nL+adOpngC56Xj+m4ymDqrFm5y+vRt5POoNYCQjsvH65yFOaVDytTip9eLDfToqh9dYvgv3SMVtPT5DeEtPhvgf73aTTeQZdD/a7KbmCuzaBPYL91NFPT79MetPK7k55sN9MKpo52QT1xIP9VtJ7a5CI9WC/lfSxBKz482C/leoiOPdgv5VMhSB8mnuw30j6aMcedwk82O8k5WOzHW8P9jtJb8PTZvHMg/0+0lXRe6r88WC/kTS47Hx44nMj76NY+CKsTszns3Mnc3USK4zD4km/B5k76aJVfjM9nri7d87Q00s0cdQzHv3MuHrC029SxbGPVLXuf6o2bzJ3Y7DqSTqP4X+qNm8y5e2s1pgqhl+66tfTHSptHFypnP9//5nBv57MmXvibHZR3B/6ydK/mMyF51QuT0dk1ne+5eklMpxNrh/dlXH3ohpPr5C5TnUK2Wx2fN97frlTYFgZlDY7rXj3Z3s9vUTG1TO/QcYPHmze+SOw/ypVzTHGsFsqdfmZSJ+GegfBbvpUXnXivey3kPyhKUv+2MGbaJ7+yZGNj2jeRb2x87u12xd+28vTs1T7GByIvwdvPPvtSVPU7vYnk/n8/Ye/PXny5MnTX0//AR+JBsuvGtx0AAAAAElFTkSuQmCC"
            alt=""
          />
        </center>
          <Input
            placeholder="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            placeholder="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />  
          <Input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" onClick={signUp}>Sign up</Button>          
       </form>
        
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={()=> setOpenSignIn(false)}
      >
       <div style={modalStyle} className={classes.paper}>
       <form className="app__signup">
       <center>
          <img
            className="app_headerImage"
            src="data:image/png;base64,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"
            alt=""
          />
        </center>
          <Input
            placeholder="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />  
          <Input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" onClick={signIn}>Sign In</Button>          
       </form>
        
        </div>
      </Modal>
      <div className="app_header">
        <img
        className="app_headerImage"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWwAAACKCAMAAAC5K4CgAAAAilBMVEX///8AAADw8PANDQ2AgID8/PxKSkr4+Pji4uLS0tL09PQbGxtERETX19f5+fmwsLDIyMjo6OhTU1Pf39+5ublsbGxmZmZ7e3vCwsKxsbF1dXWpqakiIiKcnJyjo6POzs6JiYmUlJQ7OzseHh42NjYrKytnZ2dYWFgvLy+GhoYWFhYLCwuPj49eXl6KJqLXAAATgElEQVR4nO1d13riOhCm2XSCDQRCNz2U93+9g8o02ZRlzdkvu5qr4BiVX9M1EoWCJ0+ePHny5MmTJ0+ePHny5MmTJ0+ePHny5MnTK9T7DlvD2Ue/266V/vRY/nKqfheRTsdmq51Xw91+Pcqrrb+ESvuipFY1p4bLxeI2roy8sCBVQwfrYpgT2HXb3iHp5NPgz6eBi3WxklPLH9hiklOLP53mKayL3zk1PfNgS6of02APc2r7jC3Oc2rxh9MljXUxzknFkpPzlU+DP5z6GVgXyzm5D0NssZtPgz+ctgaM1aw/2ecO9hhbrOfT4M+mL4PFUvl6wWfeYJOfU8unwR9NnZB7H4u8wd5Bgycf1hQKIw3FxsYwKuDLFWwUlWM+7f1sMmj07adG3mCjp7PNp70fTe2jQKKXsxoJ0OSGubT3synRSGB0188b7Bga/MylvZ9NLY3EAj4ucwa7gxmuvJItP5jaxjw24HMlZ7BLK2hwlkt7P5oSR8TzBrvWhAY/cmnvR1PL4bqcwG5EtXa7Xq+3KZ84LP3zCW0DxAg/5wJ2d9CaHk9Fh7b7wXg4HFa+z/PuPxlN2oCR0hZ5gB25MGfQJ+xx1ufDz8H3/HHiJOh1fy+7Ek2+d7vhbPTHBMyk9tfEaHmAXTo8gXZZo91GZ2XVD+61GZ2P+qXGvZfuNoAZsdPkDyUOzAg21HsuamS0fQJt5dpP+IOwH93Euw8trj6izM3R6gN+7XIG2Mx7Oe2w/grZkKNF/JKPgYxmcTbe68Mq3A+Gy+WlPHGwvtL2kmRXPfAXt/vvrjO2Un8c7xeZ37RUL8ueTvF3brUaz1J1qruOaZ1zc/1K9a9ksOYTHMz7dWLLqFPoZqxGM0svp15sDnvs3xM9i8O9wUwzuvq/t+kaxcdgL75Gvbvq9B7VqEQihWKQAUAxa0OnlPXaGPUGsP1t7qAs/V20S/XeyybhCXoC7NpVAE+byvNCFzSuLnYb1C+G/9OUt3dOT19RKwXaOPO9GN6DjbfbYGfu+12pJ96K1sXTejX+ep217pMFO7yjs6HI5qkAsFr7quxXSma38SQQ7R1cbXzTQZw4L7ZvvAfJFthSvmnzOvGNFmQFAcy0/KYsjgV7dccbga2b1uPW2ktRV6XHjPu9K1dCk1tgu7lYVkAUThZd2kG2islKSPnmuEa3etoKBsDs8hNTfYUs2FPqNAX26MkRBJONOxflHyBSoSOcJfb6dNaO6qhV1lIGehSKGulCc2k5cPYIbF7GuFxEvTmaS6EcUdTuZd6D0m3/9AFZsE/UaQps0Hf3wQ7mGfZe6QM0TbHzDcZuA6MA2oCqNKUJvgemE/ItdkhgIHfzr9GiXUvZuBr11DKGowQSKEpZGo/BNl+MX6uAgfbJA3gN7HqmVlRbbchVF+crpBx28Mhu87NMzZUCzNGiLm/YhT2UxNc0naabeDwRlo+c9BbIDGgMURFXfQw21NKFr9TAVLfOPNJgQ2Ekgd1JxXA3rL2Sl1sbNRTSb0hrHGiRkNA8Xkh87SCt9stQyadvxt/k91HcYxX/UgzpIdgBxQ0vZOcDux07cOdBYANfINj9q7IdCz+OClUFrdSatODToCAISyY4tEkG2MiXjFv7AmxqihE5GsiwfK/IfkdUj6Z0dqfen/S5kHCmeqHw1LpNd3ZqXLDN5yYzLbeMvV58VAJOoSYWtzIfH0yfABt25/liWS1s1Ui9mEHkzVL4yRzxTgp+ptst2F2z77HC4QRCWQpl9xTBWqGApcAGVCzYwEZk7xrCC2ntxjFrIEBt4TivOG7uv9eMMub2pwoFtiL1YfsyigUMa5Nn0GltcFnHvIVVelDo+hmwI5zX2b4gV3VX+FXqOO2lwQaPzIBdQrWALgOv7f6sXxmqMz8hZAHmo86i3wASQ6JOqrpK4Q8IyMyHeba3r+j1COu9NtWCMyuE8adgRSMwQtzQOhiwyZ+H8qJKkdMLNdXWWyiD9UmBDX0asBPsCy0EY2zQY1fFMjXC10GPUJbCo36UdjN0gCLRW4r3zDPLqr0mrC0tLRUWNsDNW4sWxrwFQ6j7NdjMYWzaMctEpoz1nyJQuIBdCmxw0TTYPaqaB5RYlogEqwEjaSDY0nyjnpdZAAMMTxAl9j2ZQDXPrLDUtI8wEr3RUHBZBbCWh4Q/iso9pBc42NIPkM09SXbhIa5JgQ0GquWMAAwm8wUysqMl3FyXGQ/0MUS0aKPKHXtolcBGZJkisX5G06vOMSxhah8VrVxWI9ErPmRkAAU2+TAItowlft0+FljQYpgRDwoA2CCFClwmWqhEyRcJM/KTEYqCnCskA4VsB2AQ1ktoCk6xyZDILpU1ghpsnVQkKSPXFOZXFqE5TvMz/aYGm0dKBmy5/5BOYj5F4PMfk1oQdTGVBGCD76bA5klRgIk4O8ti9HCEwp/DQuI9f8jkFNQAZP2Fea2CixNPlAxosHUuDVVGk14GoykSYYxrKAnHwRYZcNNaojGGZ08eE23PzzOu3KOM00sMbGi+xaWUzYe4aZnVGbpjAuwA1lSYTWbtpw4q4ts8tlhaAxkrC48qY5du9HKrBdQkyMyhk/81U1UwhVht7sRo2WRZl9ubrN0pAhvQajlbhlj3ijY6y2SQayrgasCXhOZjudSL831h+pOieFEv6EBgyAwEsKhwqZmPSNYApxc6U9Vga3XZxyE+E65jhizroaCjHQR8btkc/NQqhhV8G3VLlhojJSNgjUC7CJvKsuGg4S0jlIUdZRJwWlj/WOsZdPlZnggyYcJAs3P6tAgcbAXqAcajwVa+QZMKoJ+wj2jNZIzwkapeujZswIao5wq2AW5m9QqGkDVUyxlKm6RGjA60w1qsD2Vpj8DJllelM8K2yRRDa+7XgnN2v14gH2J0owWSOGT3sBApqzAH9BXYDaVFZoV0THeTIgR1I//RxkaQpsagoJ5uGb+vVbJtUDSC24wZsvUA7AO3WmwDGA9h2vnGwhwxdaP4VTOB9jWA5be0Ng0w8BydgB38JJlhYKthnyJQ4gpsterHqIoR3OM9WVrQlH79cm8KsLkpyjvq1S6OSqkW2NBT1QHkGHKwI3Rx+K4Hc23R/FgAPvl73FNY2D5ONT4/1mwEnguXoQZNdkrFPQmBrVbtUuBgqwUeFkpga5oPPT/ywzJO21bbs8E+3GPiyN7KgGY51kwWduAB6rrqmW07uWgT2DzdjrIgtm961MwSnp0d8BV1WH+KLxUmRs8A2Mzz6Fnd1OSKiIrGee76TM+UoM/QFW3ayudFIQJNJ3Yvo6zKIrLB0+xt/041QOa3zIQI7LXymyD66PlerVJI3uNSloFlg41KS2RGmFeE+shaMiGIjC/1jrqa1kV3C/qFGY/EPhJan2U52AgQ7FgfmetxsJXpveoyTFccWHOLQzlj44YG6VYLEKFKsPPDVJhm+WMN1S16yFehvrDk40XEkZlg19ASCo5lQRuOr5JCr0DsdWWwwL5jUmDAKcx7xwCYD4u8f76MJG9q1McGB1tx2px5snzt9lnGiqKXO4UROBHLuTKHOyBWx/ZXij3alPs7cttB3MrAphUQHJtQPxjbDzMGzOpItHLe4xcgdcN4CeYs7qph+Ry2jOhR7tVfnwUGtlqdU8TQYMUfyjlO3+6Bbw5uh5oUD364aCn6oqkC2B2DRcQMPEuD0LQY2KTOBMdWMlrIAptJgNb5SifIxA65c7gwwp9he0vU8gItWrwy+BHYSsMovZoFtuoirSmgi/2dsJ6GUU+Nq6jtEQwfTCH0VWVYfWMPJLAMbFJnHGzuZCDYWWqEpR6VxlW+aNN0mKT6wnSLADuhFghsCnS0lI7oy2u9nmqSbVgQBvZHMSvEsQHC4V7xIPUYiC/ZLoK0GlFsaoJ/FojG0AepLgKApVi4GmlkBJAwHrEoLCZQOl/Jng2IYQTkU+PCCDXCHHVq2anGKBHYW83QyuVAA8nAVkNMbyT03ZGkifYT5f6upWWh4BpIFcODae4RDFuruGmnhhafl+ewviMWxqIHmeH6sQ0MDZVa7b5smaZIWTrOYs5yme5llZHaCkM1otJPG/ESM5BXnXNI6woDtlssk/GKIvDsxO1Rak6On60YHd2nKkn4uotDoe8aYokJPhhuihPn3R0Lavjyq0FcjcXaThYYAcGm5B331TiumON1al+UNRDVPxoQrHYhP1t1kZEC7AoUs4jyLCj1M94hT9BbnJRSZRESvb42ugUVMdqQKtvK4wWAvCcQblAtF+a981BXeXwbEgQYG0oRLcyRO8asBcxbOPe/VVywNSAdkAnKvkyKmVmp3kOwaXW3gELC+tMPq7YqyKRYVVDKmYYN0EwPndclvMFN7oqByGcLsgK+EFMCItOsGp0fEhgs7CrAwgY7epWpVb6ZWLYtu5X5k4Jk9rWZJPpc4N8qs56V7jS7HveKj4nnEBq+OWNEDhSDFiQlCkNR1kkj3AloUdcoUJsWFZYx0vuP240EF6KUJgXEooQeh2lpJx/zIwvMG9KmEKZhF8FNM3cLki1sYuGb/19RrXjjCoSYEMskylORlPC5zcRbV0XVsZOLuTUmF1Cpzhrab4ufVs1L2wjbGNRMPPhmX+XVwthBSWSDXTGFvJX9yA0O6Tq9BAcQQauCnNOEOjLj6sY6X4g/9Fwp3rhpTPe9vXkLLZMacoi4Ju3K1y5DtH5lFseQnKuHWPVftlZLawsspyFtp5+PYDJG/j5FU5rk2RAXbGtkbdZP7xav7OpQbZ6GeQmH6vcdC82Jl3FrkeNHHuzoMVVkOb3dzCjzN2/qfm8dkmKxImM4pt8su9fEETCgJXk/+Ewk9K2HoZfqgkyDaGnHb9uAW5N0LaESbQsV2Pu6/ozOX8oAma/z8lY4QYmOj1n+OqpfxfIqevzkmkRFFNw8AItiMGCSEkF8E1CTeF5nZ/xGbKeehfpsCWAFWQR3fQjcF4PEUMyiFwfZ49jAT33MXePmmlY+S1KK0/5C/dmyImCVu82NouZMgW3Vk5FBBUxcHUi4zHKvWI3DrD5Tq9dLq+gmfQZeQt5Ry1/Vk78RkJupZt4fzNUFd8jY6gJv8NPScYleOBtwMWIw4SFtLbQW9RkOAFasx9e0lDqGV4el03qlZuznFPtcutOwEqPVYKL+6qN/ZF2U2tY85n6uog+honfEAWwuAo/9vMLbTZP59z4VXdb5BaFT8e8MDwUPN65nV27t4/ofw2ElRhGHiDZdUTwiVOwsumsEVAQXX+QRJu1FYntKUHhSYENVbw04ODC7h1faBDR2zU685Ej1zT8P+dIVuawLuS7eO6bQMEw5TbhnWK0PeelIU7roZNHpebU/jMNw8GFaaWce6RyjtnL3N42EwPJOGo2evgQAttCZC4E7jIrQDTlEyF7pinS7tK3ZAMec4IgatYnhHRPOdmnayn3lFWdWP2GUQA6AI3rHO9kPdKZ2s25UulKvf5a7j+6uQwdcventy/QXFbfQZ8jG4JwMOBnBweh8C1oJUlsjG01vzEhcVroaJLQDGUGDeF3bVSy3nB4ccwt3QpS1KuAZLhjLl1FcIZu7iCvvHw/tpQ7QSWqlo6Fefz6bTRb3T6S1P86D1ra5PrQ+z5OF3BsTIT8mSdw7uynBEHxV4nAIV2I0nHRcHJDVHjdSbhe/494ew3GrkFgWqbu8hIO5/UxlAszDiOrdhcSEey0PjuJG2YeTDR3Pv3M1RKAp4x8J64LsiXSZ42wn6UoloaZONabXy+tp6N4e0kD7M4SV+BKR0PFWZTXbALkLIlq41eNDY6PU7xtYao7fdS3EBHzzJq9Cm9Amd/Fy5xKIzozEUVsUWSndcvRbMFEb0Mfwi9Z9waRjdVvLBvXZZ3iYblfD+1dSBIvzZxzvnrskZjRwrt/Qg5i98eKmaKksU3Mou6iO5slY/ePw4DqKxijZ6S38lkZK6qWMuoxet+uw72KSVNSSHZePECpFL5/hvUWL2TAGw3FsDc79t/+WTKl3o4ueC8wtWnwYplzIPH/qCoKbFP3mLVP/IDG+Dkcfs/t3S3n6HQr4mS1/5ehbqaqcKbQ4yz89nL+adOpngC56Xj+m4ymDqrFm5y+vRt5POoNYCQjsvH65yFOaVDytTip9eLDfToqh9dYvgv3SMVtPT5DeEtPhvgf73aTTeQZdD/a7KbmCuzaBPYL91NFPT79MetPK7k55sN9MKpo52QT1xIP9VtJ7a5CI9WC/lfSxBKz482C/leoiOPdgv5VMhSB8mnuw30j6aMcedwk82O8k5WOzHW8P9jtJb8PTZvHMg/0+0lXRe6r88WC/kTS47Hx44nMj76NY+CKsTszns3Mnc3USK4zD4km/B5k76aJVfjM9nri7d87Q00s0cdQzHv3MuHrC029SxbGPVLXuf6o2bzJ3Y7DqSTqP4X+qNm8y5e2s1pgqhl+66tfTHSptHFypnP9//5nBv57MmXvibHZR3B/6ydK/mMyF51QuT0dk1ne+5eklMpxNrh/dlXH3ohpPr5C5TnUK2Wx2fN97frlTYFgZlDY7rXj3Z3s9vUTG1TO/QcYPHmze+SOw/ypVzTHGsFsqdfmZSJ+GegfBbvpUXnXivey3kPyhKUv+2MGbaJ7+yZGNj2jeRb2x87u12xd+28vTs1T7GByIvwdvPPvtSVPU7vYnk/n8/Ye/PXny5MnTX0//AR+JBsuvGtx0AAAAAElFTkSuQmCC"
        alt="Instagram"
        />
        {user ? (
          <Button onClick={()=> auth.signOut()}> Logout </Button>
          ): (
            <div className="app__loginContainer">
            <Button onClick={()=> setOpenSignIn(true)}> Sign In </Button>
            <Button onClick={()=> setOpen(true)}> Sign up </Button>
            </div>
            )
        }
      </div>
      <div className="app__posts">
        <div className="app__postsLeft">
          {
            posts.map(({id, post})=> (
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />          
            ))
          }
        </div>
        <div className="app__postsRight">
          <InstagramEmbed
              url='https://www.instagram.com/p/CRl8i4tjT3g/'
              clientAccessToken='228532285834116|IGQVJYSE1udjNOY1hZAeV85NExBeGpNa2ktbm50YTNrZAVVTMjVIcXk0U2s1ZA2QtakxOMS1QSXJ1Uk84Nm1aZAXJidmhqWmNLRDZAVN3J6WkxINXF1UDIzT1RCSFFCUkhVcUdVd09EbUcwWHNiNHNqTldvTAZDZD'
              maxWidth={320}
              hideCaption={false}
              containerTagName="div"
              protocol=""
              injectScript
              onLoading={() => {}}
              onSuccess={() => {}}
              onAfterRender={() => {}}
              onFailure={() => {}}
            />
        </div>
      </div>
      {user?.displayName ? (
        <Imageupload username={user.displayName} />
      ): (
        <h3>Sorry you need to login to upload</h3>
      )}
    </div>
  );
}

export default App;
