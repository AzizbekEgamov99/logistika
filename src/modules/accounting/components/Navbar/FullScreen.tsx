import React from 'react';
import { FullscreenExitOutlined } from '@ant-design/icons';
const FullScreen = () => {
    const [isFullscreen, setIsFullscreen] = React.useState(false);
    console.log(isFullscreen);
    const toggleFullscreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
            setIsFullscreen(false);
        } else {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        }
    }
    return (
        <FullscreenExitOutlined style={{ fontSize: '20px' }} onClick={toggleFullscreen} />
    );
}

export default FullScreen;
