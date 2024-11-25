'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@withbee/ui/button';
import { Title } from '@withbee/ui/title';
import Image from 'next/image';
import styles from './page.module.css';
import Link from 'next/link';

const CardIssuancePage = () => {
  const [issuanceState, setIssuanceState] = useState('initial');

  const handleIssuance = () => {
    setIssuanceState('processing');
    setTimeout(() => {
      setIssuanceState('complete');
    }, 7000);
  };
  const rotationDuration = 2.8;
  const circleSegments = Array.from({ length: 25 }, (_, i) => i);

  return (
    <div className={styles.container}>
      <Title label="카드 혜택" />
      <AnimatePresence mode="wait">
        {issuanceState === 'initial' && (
          <motion.div
            className={styles.cardWrapper}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Initial state content remains the same */}
            <h1 className={styles.title}>위비 트래블 체크 카드</h1>
            <motion.div className={styles.withbeeCardWrap}>
              <Image
                src="/imgs/cardBenefits/withbee_travel_checkcard.png"
                alt="위비트래블 카드"
                width={250}
                height={235}
                quality={100}
              />
            </motion.div>

            <div className={styles.benefitsContainer}>
              {[
                {
                  icon: '/imgs/cardBenefits/2.png',
                  title: '여행 공동 지출 관리 서비스',
                  desc: '여행 종료 후 결제 내역을 바탕으로 멤버별 지출 금액을 자동 계산',
                },
                {
                  icon: '/imgs/cardBenefits/1.png',
                  title: '해외 가맹점 이용수수료 면제',
                  desc: '국제브랜드 수수료(Mastercard 1%) 및 해외서비스 수수료(거래 건당 US$0.5)면제',
                },

                {
                  icon: '/imgs/cardBenefits/3.png',
                  title: '쿠팡, 배민, 스타벅스 5% 캐시백',
                  desc: '공식 앱 및 홈페이지를 통한 온라인 결제 건에 한함',
                },
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  className={styles.benefitCard}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={styles.benefitIcon}>
                    <Image
                      src={benefit.icon}
                      alt={benefit.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className={styles.benefitContent}>
                    <div className={styles.benefitTitle}>{benefit.title}</div>
                    <div className={styles.benefitDesc}>{benefit.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className={styles.btnWrap}>
              <Button label="발급받기" onClick={handleIssuance} />
              <button className={styles.skipText}>
                카드 발급 없이 참가하기
              </button>
            </div>
          </motion.div>
        )}

        {issuanceState === 'processing' && (
          <motion.div
            className={styles.processingContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={styles.beeCirclePath}>
              <div className={styles.trailContainer}>
                {circleSegments.map((index) => (
                  <motion.div
                    key={index}
                    className={styles.trailSegment}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{
                      duration: rotationDuration / 2,
                      repeat: Infinity,
                      delay: (index * rotationDuration) / circleSegments.length,
                      ease: 'easeInOut',
                    }}
                    style={{
                      transform: `rotate(${index * (360 / circleSegments.length)}deg)`,
                    }}
                  />
                ))}
              </div>
              <motion.div
                className={styles.beeWrapper}
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: rotationDuration,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <div className={styles.bee}>
                  <img
                    src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Honeybee.png"
                    alt="Honeybee"
                    width="60"
                    height="60"
                    className="object-contain"
                  />
                </div>
              </motion.div>
            </div>
            <motion.p
              className={styles.processingText}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              위비트래블 카드를 발급하고 있습니다.
            </motion.p>
            <motion.p
              className={styles.processingText2}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              조금만 기다려주세요.
            </motion.p>
          </motion.div>
        )}
        {issuanceState === 'complete' && (
          <motion.div
            className={styles.completeContainer}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring' }}
          >
            <motion.div
              className={styles.completeCard}
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ type: 'spring', bounce: 0.4 }}
            >
              <Image
                src="/imgs/cardBenefits/withbee_checkcard.png"
                alt="발급된 카드"
                fill
                className="object-contain"
              />
            </motion.div>
            <motion.h2
              className={styles.completeTitle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              카드 발급이 완료되었습니다!
            </motion.h2>
            <motion.div
              className={styles.completeMessage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              친구를 초대하고 여행을 만들어 보세요.
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Link href="/travel">
                <Button label="여행 생성하러 가기" className={styles.goTrip} />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CardIssuancePage;
