import React from 'react';
import { Modal, Tabs, Switch, Radio, ColorPicker } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
    setTheme,
    setPrimaryColor,
    toggleNavbarFixed,
} from '../../../store/slices/settingsSlice';
import styles from './SettingsModal.module.css';
interface SettingsModalProps {
    visible: boolean;
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose }) => {
    const dispatch = useDispatch();
    const settings = useSelector((state: any) => state.settings);

    const items = [
        {
            key: '1',
            label: 'Theme',
            children: (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={styles.settingsSection}
                >
                    <h3>Theme Mode</h3>
                    <Radio.Group
                        value={settings.theme}
                        onChange={(e) => dispatch(setTheme(e.target.value))}
                    >
                        <Radio.Button value="light">Light</Radio.Button>
                        <Radio.Button value="dark">Dark</Radio.Button>
                    </Radio.Group>

                    <h3>Primary Color</h3>
                    <ColorPicker
                        value={settings.primaryColor}
                        onChange={(color) => dispatch(setPrimaryColor(color.toHexString()))}
                    />
                </motion.div>
            ),
        },
        {
            key: '2',
            label: 'Layout',
            children: (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={styles.settingsSection}
                >
                    <h3>Navigation Layout</h3>
                    {/* <Radio.Group
                        value={settings.layout}
                        onChange={(e) => dispatch(setLayout({ type: 'SET_LAYOUT', payload: e.target.value }))}
                    >
                        <Radio.Button value="vertical">Vertical</Radio.Button>
                        <Radio.Button value="horizontal">Horizontal</Radio.Button>
                    </Radio.Group> */}
                    <h3>Fixed Header</h3>
                    <Switch
                        checked={settings.navbarFixed}
                        onChange={() => dispatch(toggleNavbarFixed())}
                    />
                </motion.div>
            ),
        },
    ];

    return (
        <Modal
            title="Settings"
            open={visible}
            onCancel={onClose}
            footer={null}
            width={500}
            className={styles.settingsModal}
        >
            <Tabs items={items} />
        </Modal>
    );
};

export default SettingsModal; 