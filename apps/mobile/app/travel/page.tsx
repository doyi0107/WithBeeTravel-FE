'use client';
import styles from './page.module.css';
import { Title } from '@withbee/ui/title';
import Image from 'next/image';
import { InviteCodeModal } from '../../components/InviteCodeModal';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { postInviteCode, getTravelList } from '@withbee/apis';
import useSWR from 'swr';
import dayjs from 'dayjs';

export default function page() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '초대 코드를 입력하세요.',
    closeLabel: '입력 완료',
    subtitle: '초대 코드를 입력하여 그룹에 가입하세요.',
  });
  const router = useRouter();

  const { data: travelData, error } = useSWR('travelList', getTravelList);
  if (travelData && 'data' in travelData) {
    console.log(travelData.data);
  }

  if (error) return <p>데이터를 불러오는 중 오류가 발생했습니다.</p>;
  if (!travelData) return <p>데이터를 불러오는 중...</p>;

  // if ('travelStartDate' in travelData) {
  //   const today = dayjs();
  //   const startDate = dayjs(travelData.travelStartDate);
  //   const dDay = startDate.diff(today, 'day');
  // }

  // 초대코드에 맞는 여행 홈으로 이동
  const handleInviteCodeSubmit = async (inviteCode: string) => {
    const response = await postInviteCode(inviteCode);

    if ('code' in response) {
      alert(response.message);
      throw response; // 에러 코드가 있는 응답은 그대로 throw
    }

    // 여행 존재하면 해당 여행 홈으로 이동
    if ('data' in response && response.data) {
      router.push(`/travel/${response.data.travelId}`);
    }
  };

  return (
    <div className={styles.travelSelectWrap}>
      <Title label="여행 선택" />
      {/* 위비프렌즈이미지 */}
      <div className={styles.imageWrap}>
        <Image
          src="/imgs/travelselect/withbee_friends.png"
          alt="위비프렌즈친구들"
          className={styles.withbeeFriendsImg}
          width={500}
          height={500}
        />
      </div>

      {/* 여행생성, 초대코드 버튼 */}
      <div className={styles.buttonWrap}>
        <button
          className={styles.button}
          onClick={() => router.push('/travel/form?mode=create')}
        >
          <div className={styles.buttonTitleWrap}>
            <p className={styles.buttonTitle}>여행 생성하기</p>
          </div>
          <div className={styles.imgWrap}>
            <Image
              src="/imgs/travelselect/travel_select_plane.png"
              alt="비행기 아이콘"
              className={styles.icon}
              width={50}
              height={50}
              layout="intrinsic"
            />
          </div>
        </button>
        <button className={styles.button} onClick={() => setIsOpen(true)}>
          <div className={styles.buttonTitleWrap}>
            <p className={styles.buttonTitle}>초대 코드 입력하기</p>
          </div>
          <div className={styles.imgWrap}>
            <Image
              src="/imgs/travelselect/travel_select_invitecode.png"
              alt="초대코드 아이콘"
              className={styles.icon}
              width={50}
              height={50}
              layout="intrinsic"
            />
          </div>
        </button>
      </div>

      {/* 생성한 그룹 나열하기 */}
      <div className={styles.cardWrap}>
        {travelData &&
        'data' in travelData &&
        Array.isArray(travelData.data) ? (
          travelData.data.map((card, index) => {
            const today = dayjs();
            const startDate = dayjs(card.travelStartDate);
            const dDay = startDate.diff(today, 'day');

            return (
              <div key={index} className={styles.card}>
                <Image
                  src={
                    card.travelMainImage
                      ? `/${card.travelMainImage}`
                      : '/imgs/travelselect/travel_base_mainImage.png'
                  }
                  alt={card.travelName}
                  className={styles.cardImage}
                  width={200}
                  height={100}
                />
                <div className={styles.cardContent}>
                  <div className={styles.cardText}>
                    <Image
                      src={`/${card.travelMainImage}`}
                      alt="비행기 아이콘"
                      className={styles.icon}
                      width={50}
                      height={50}
                    />
                    <div className={styles.travelNameWrap}>
                      <span>{card.travelName}</span>
                      <span className={styles.date}>
                        {card.travelStartDate}
                      </span>
                    </div>
                  </div>
                  <div className={styles.cardDay}>
                    {dDay >= 0 ? (
                      <span>{`D-${dDay}`}</span>
                    ) : (
                      <span>{`D+${Math.abs(dDay)}`}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p>여행 목록을 불러오는 중...</p>
        )}
      </div>

      {/* 초대 코드 모달 */}
      <InviteCodeModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleInviteCodeSubmit}
        modalState={modalState}
      />
    </div>
  );
}
