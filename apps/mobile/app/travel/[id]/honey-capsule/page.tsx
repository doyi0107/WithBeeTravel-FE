'use client';

import styles from './page.module.css';
import { Title } from '@withbee/ui/title';
import Image from 'next/image';
import { Button } from '@withbee/ui/button';
import { HoneyCapsule } from '@withbee/types';
import { useEffect, useState } from 'react';
import { getHoneyCapsule } from '@withbee/apis';
import { useToast } from '@withbee/hooks/useToast';
import { ERROR_MESSAGES } from '@withbee/exception';
import { HoneyCapsuleBox } from '@withbee/ui/honey-capsule';

interface HoneyCapsuleProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: HoneyCapsuleProps) {
  const { id } = params;
  const { showToast } = useToast();
  const [honeyCapsuleData, setHoneyCapsuleData] = useState<HoneyCapsule[]>();

  const handleGetHoneyCapsule = async () => {
    const response = await getHoneyCapsule(id);

    if ('code' in response) {
      showToast.warning({
        message:
          ERROR_MESSAGES[response.code as keyof typeof ERROR_MESSAGES] ||
          'Unknown Error',
      });

      throw new Error(response.code);
    }

    if (response.data) setHoneyCapsuleData(response.data);
  };

  useEffect(() => {
    handleGetHoneyCapsule();
  }, []);

  return (
    <div>
      <Title label="HONEY CAPSULE" />
      <div className={styles.container}>
        <div className={styles.downloadWrapper}>
          <div className={styles.imageWrap}>
            <Image
              src="/imgs/travelselect/withbee_friends.png"
              alt="위비프렌즈친구들"
              className={styles.withbeeFriendsImg}
              width={500}
              height={500}
            />
          </div>
          <span className={styles.comment}>
            여행 기록을 간직해보세요!
            <br />
            결제 내역에 남긴 기록을 모아 PDF로 생성해드립니다.
          </span>
          <Button label="허니캡슐 생성하기" />
        </div>
      </div>
      {honeyCapsuleData?.map((honeyCapsule) => (
        <HoneyCapsuleBox
          key={honeyCapsule.sharedPaymentId}
          data={honeyCapsule}
        />
      ))}
    </div>
  );
}
