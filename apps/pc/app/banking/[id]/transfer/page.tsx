'use client';
import { useParams, useRouter } from 'next/navigation';
import styles from './page.module.css';
import { Title } from '@withbee/ui/title';
import { useEffect, useState } from 'react';
import { Button } from '@withbee/ui/button';
import { getAccountInfo, instance, verifyAccount } from '@withbee/apis';
import { useToast } from '@withbee/hooks/useToast';
import { AccountInfo } from '@withbee/types';
import { motion } from 'framer-motion';

export default function TransferPage() {
  const router = useRouter();
  const params = useParams();
  const accountId = params.id;

  const [accountInfo, setAccountInfo] = useState<AccountInfo | undefined>();
  const [targetAccount, setTargetAccount] = useState(''); // 송금할 계좌번호 상태
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 상태
  const [loading, setLoading] = useState<boolean>(true);
  const { showToast } = useToast();
  // 계좌 정보 가져오기
  useEffect(() => {
    if (accountId) {
      (async () => {
        const response = await getAccountInfo(Number(accountId));
        console.log(response);

        if ('data' in response) {
          setLoading(false);
          setAccountInfo(response.data);
        } else {
          console.error(response.message);
          // TODO: 에러 페이지로 이동 예정
          router.push('/mypage');
        }
      })();
    }
  }, [accountId]);

  if (loading) {
    return null;
  }

  const formatNumber = (num: number): string => {
    return num.toLocaleString('ko-KR');
  };

  // 계좌번호 검증 후 금액 설정 페이지로 이동
  const handleNextClick = async () => {
    if (targetAccount.length < 10) {
      showToast.error({ message: '계좌번호는 10자리 이상이에요!' });
      return;
    }

    if (targetAccount === accountInfo?.accountNumber) {
      showToast.error({ message: '동일 계좌로는 송금 할 수 없어요.' });
      return;
    }

    const AccountNumberRequest = {
      accountNumber: targetAccount,
    };

    // localStorage에 계좌번호 저장
    localStorage.setItem('targetAccountNumber', targetAccount);

    try {
      const response = await verifyAccount(targetAccount);

      if (Number(response.status) === 200) {
        router.push(`/banking/${accountId}/transfer/detail`);
      } else {
        showToast.error({ message: '존재 하지 않는 계좌번호예요!' });
      }
    } catch (error) {
      console.error('계좌번호 검증 중 오류 발생:', error);
      alert('계좌번호 검증에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 가상 키보드 생성
  const renderKeyboard = () => (
    <div className={styles.keyboard}>
      {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'X', '0', '←'].map(
        (key) => (
          <button
            key={key}
            className={styles.keyboardKey}
            onClick={() =>
              handleNumberPress(
                key === '←' ? 'backspace' : key === 'X' ? 'clear' : key,
              )
            }
          >
            {key}
          </button>
        ),
      )}
    </div>
  );

  // 숫자 버튼 클릭 처리
  const handleNumberPress = (key: string) => {
    if (key === 'backspace') {
      setTargetAccount(targetAccount.slice(0, -1)); // 백스페이스 처리
    } else if (key === 'clear') {
      setTargetAccount(''); // X 누르면 전체 삭제
    } else {
      setTargetAccount(targetAccount + key); // 숫자 추가
    }
  };

  // 계좌번호 입력 부분 렌더링
  const renderAccountInput = () => (
    <div className={styles.amountContainer}>
      <div className={styles.accountInfo}>
        <h2>내 계좌</h2>
        {accountInfo ? (
          <motion.p
            className={styles.balance}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className={styles.balance}>
              ₩ {formatNumber(accountInfo.balance)}
            </p>
          </motion.p>
        ) : (
          <p style={{ height: '36px' }}> </p>
        )}
      </div>

      <div className={styles.targetAccount}>
        <h3 className={styles.text}>송금할 계좌</h3>

        {/* 사용자가 직접 입력 가능하도록 수정 */}
        <input
          type="tel"
          className={styles.input}
          value={targetAccount}
          onChange={handleAccountChange} // onChange 핸들러 수정
          placeholder="계좌번호 입력"
        />

        {/* 오류 메시지 출력 */}
        <p className={`${styles.error} ${errorMessage ? 'visible' : ''}`}>
          {errorMessage}
        </p>
      </div>
    </div>
  );

  // onChange 핸들러: 숫자만 입력하도록 필터링
  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // 숫자만 허용하는 정규 표현식
    const numericValue = inputValue.replace(/[^0-9]/g, ''); // 숫자가 아닌 모든 문자는 제거

    setTargetAccount(numericValue); // 상태 업데이트
  };

  return (
    <div className={styles.container}>
      <Title label="송금하기" />

      {renderAccountInput()}
      {renderKeyboard()}

      <div className={styles.buttonLocation}>
        <Button
          label="다음"
          size="medium"
          onClick={handleNextClick} // 계좌번호 검증 후 금액 설정 페이지로 이동
        />
      </div>
    </div>
  );
}
