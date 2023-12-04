    import React from 'react';
    import { NavigationBar } from './NavigationBar';
    import main from '../styles/mainPage.module.css';
    import videoSrc from '../videoplayback.mp4';

    export const MainPage = () => {
    return (
        <div>
        <NavigationBar /> 
        <div className={main.mainDiv}>
            <video autoPlay loop muted className={main.backgroundVideo}>
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
            </video>

            <div className={main.content}>
            
            </div>
        </div>
    <div>


    </div>
<h1>

</h1>
        </div>
    );
    };
