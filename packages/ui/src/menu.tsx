'use client';

import Image from 'next/image';
import { Button } from './button';
import styles from './menu.module.css';
import { Item } from './item';
import { useState } from 'react';
import { BottomModal } from './modal';
import selectIcon from './assets/select.png';
import DatePickerModal from './date-picker-modal';
import { usePaymentStore } from '@withbee/stores';
import { getDateObject } from '@withbee/utils';

interface MenuProps {
  className?: string;
}

export const Menu = ({ className, ...props }: MenuProps) => {
  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    sortBy,
    setSortBy,
    setIsDateFiltered,
  } = usePaymentStore();
  const [isOpen, setIsOpen] = useState({
    period: false,
    member: false,
    sort: false,
    start: false,
    end: false,
  });
  const [selected, setSelected] = useState({
    period: '전체',
    member: '전체',
    sort: sortBy === 'latest' ? '최신순' : '금액순',
  });

  const [isFilter, setIsFilter] = useState(false); // 필터 메뉴인지 여부

  // 모달 열기/닫기 핸들러
  const handleModal = (key: 'period' | 'member' | 'sort' | 'start' | 'end') => {
    setIsOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // 정렬 변경 핸들러
  const handleSort = () => {
    handleModal('sort');
    setSortBy(selected.sort === '최신순' ? 'latest' : 'amount');
  };

  // 전체 기간 선택 핸들러
  const handleSelectAllDate = () => {
    setIsDateFiltered(false);
    setSelected({ ...selected, period: '전체' });
  };

  // 시작일/종료일 선택 핸들러
  const handleDateSelect = (type: 'start' | 'end') => {
    setIsDateFiltered(true);
    handleModal(type);
    setSelected({ ...selected, period: '기간' });
  };

  return (
    <section className={[styles.menu, className].join(' ')} {...props}>
      <Image
        src="/setting.png"
        alt="edit"
        width={28}
        height={28}
        onClick={() => setIsFilter((prev) => !prev)}
      />
      {isFilter ? (
        <div className={styles.filterContainer}>
          <div className={styles.filter}>
            <Item
              label="전체 기간"
              size="small"
              type="select"
              onClick={() => handleModal('period')}
            />
            <Item
              label="결제 멤버"
              size="small"
              type="select"
              onClick={() => handleModal('member')}
            />
          </div>
          <Item
            label={selected.sort}
            size="small"
            type="select"
            onClick={() => handleModal('sort')}
          />
        </div>
      ) : (
        <div className={styles.default}>
          <Button label="불러오기" size={'small'} />
          <Button label="직접 추가" size={'small'} primary={false} />
        </div>
      )}

      {/* 멤버 선택 모달 */}
      {isOpen.member && (
        <BottomModal
          isOpen={isOpen.member}
          onClose={() => handleModal('member')}
          title="결제 멤버"
        >
          <ul className={styles.list}>
            {['전체', '삼도삼', '진콩이', '호초루', '연콩이', '대장님'].map(
              (member) => (
                <li
                  key={member}
                  onClick={() => setSelected({ ...selected, member })}
                >
                  {member}
                  {selected.member === member && (
                    <Image
                      src={selectIcon}
                      alt="select"
                      width={25}
                      height={25}
                    />
                  )}
                </li>
              ),
            )}
          </ul>
        </BottomModal>
      )}

      {/* 기간 선택 모달 */}
      {isOpen.period && (
        <BottomModal
          isOpen={isOpen.period}
          onClose={() => handleModal('period')}
          title="기간 설정"
        >
          <ul className={styles.list}>
            <li onClick={handleSelectAllDate}>
              전체
              {selected.period === '전체' && (
                <Image src={selectIcon} alt="select" width={25} height={25} />
              )}
            </li>
            <li onClick={() => handleDateSelect('start')}>
              시작일
              <span>{startDate.replace(/-/g, '.')}</span>
            </li>
            <li onClick={() => handleDateSelect('end')}>
              종료일
              <span>{endDate.replace(/-/g, '.')}</span>
            </li>
          </ul>
        </BottomModal>
      )}

      {/* 시작일 선택 모달 */}
      {isOpen.start && (
        <DatePickerModal
          isOpen={isOpen.start}
          initialDate={getDateObject(startDate)}
          onSelectDate={setStartDate}
          onClose={() => handleModal('start')}
          title={'시작일'}
        />
      )}

      {/* 종료일 선택 모달 */}
      {isOpen.end && (
        <DatePickerModal
          isOpen={isOpen.end}
          initialDate={getDateObject(endDate)}
          onSelectDate={setEndDate}
          onClose={() => handleModal('end')}
          title={'종료일'}
        />
      )}

      {/* 정렬 선택 모달 */}
      {isOpen.sort && (
        <BottomModal isOpen={isOpen.sort} onClose={handleSort} title="정렬">
          <ul className={styles.list}>
            {['최신순', '금액순'].map((sort) => (
              <li key={sort} onClick={() => setSelected({ ...selected, sort })}>
                {sort}
                {selected.sort === sort && (
                  <Image src={selectIcon} alt="select" width={25} height={25} />
                )}
              </li>
            ))}
          </ul>
        </BottomModal>
      )}
    </section>
  );
};
