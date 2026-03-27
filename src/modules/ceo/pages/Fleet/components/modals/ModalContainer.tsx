import React, { Suspense, useEffect } from 'react';
import { Spin } from 'antd';
import { Vehicle } from '../../types';

// Lazy load modals
const CarModal = React.lazy(() => import('./CarModal'));
const FurgonModal = React.lazy(() => import('./FurgonModal'));

interface ModalContainerProps {
  isCarModalVisible: boolean;
  isFurgonModalVisible: boolean;
  selectedCar: Vehicle | null;
  selectedFurgon: Vehicle | null;
  setIsCarModalVisible: (visible: boolean) => void;
  setIsFurgonModalVisible: (visible: boolean) => void;
  handleCarModalSubmit: (formData: any) => Promise<void>;
  handleFurgonModalSubmit: (formData: any) => Promise<void>;
}

const ModalContainer: React.FC<ModalContainerProps> = ({
  isCarModalVisible,
  isFurgonModalVisible,
  selectedCar,
  selectedFurgon,
  setIsCarModalVisible,
  setIsFurgonModalVisible,
  handleCarModalSubmit,
  handleFurgonModalSubmit,
}) => {
  useEffect(() => {
    console.log('ModalContainer state:', {
      isCarModalVisible,
      isFurgonModalVisible,
      hasSelectedCar: !!selectedCar,
      hasSelectedFurgon: !!selectedFurgon
    });
  }, [isCarModalVisible, isFurgonModalVisible, selectedCar, selectedFurgon]);

  return (
    <Suspense fallback={<Spin />}>
      {isCarModalVisible && (
        <CarModal
          visible={isCarModalVisible}
          car={selectedCar}
          onCancel={() => {
            console.log('Canceling car modal');
            setIsCarModalVisible(false);
          }}
          onSubmit={(formData) => {
            console.log('Car modal submitting');
            return handleCarModalSubmit(formData);
          }}
        />
      )}

      {isFurgonModalVisible && (
        <FurgonModal
          visible={isFurgonModalVisible}
          furgon={selectedFurgon}
          onCancel={() => {
            console.log('Canceling furgon modal');
            setIsFurgonModalVisible(false);
          }}
          onSubmit={(formData) => {
            console.log('Furgon modal submitting');
            return handleFurgonModalSubmit(formData);
          }}
        />
      )}
    </Suspense>
  );
};

export default ModalContainer; 