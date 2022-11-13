import type { FC, ComponentType } from 'react';

import { useCallback, useState, useEffect, useRef } from 'react';
import { meanBy } from 'lodash';
import classNames from 'classnames';

interface LinearLayoutProps {
  leftArrow?: ComponentType<{ onClick: () => void; disabled: boolean }>;
  rightArrow?: ComponentType<{ onClick: () => void; disabled: boolean }>;
  parentClassName?: string;
  containerClassName?: string;
}

interface ArrowsState {
  left: boolean;
  right: boolean;
}

const LinearLayout: FC<LinearLayoutProps> = ({
  leftArrow: LeftArrow,
  rightArrow: RightArrow,
  parentClassName,
  containerClassName,
  children,
}) => {
  const container = useRef<HTMLUListElement>(null);
  const [disabledArrows, setDisabledArrows] = useState<ArrowsState>({
    left: true,
    right: true,
  });

  const setArrowsState = useCallback(() => {
    const target = container.current!;
    const arrowsState = { left: false, right: false };
    if (target.scrollLeft === 0) arrowsState.left = true;
    if (target.scrollWidth - target.scrollLeft === target.clientWidth)
      arrowsState.right = true;
    setDisabledArrows(arrowsState);
  }, []);

  const onClickScroll = useCallback((isLeft: boolean = true) => {
    const avgOffset = meanBy(container.current!.children, (e) => e.clientWidth);
    const moveBy = container.current!.clientWidth - avgOffset;
    container.current!.scrollBy({
      left: isLeft ? -moveBy : moveBy,
      behavior: 'smooth',
    });
  }, []);

  const onScroll = useCallback(() => {
    setArrowsState();
  }, [setArrowsState]);

  useEffect(() => {
    setArrowsState();
  }, [setArrowsState]);

  return (
    <div className={classNames(parentClassName)}>
      {LeftArrow && (
        <LeftArrow
          onClick={onClickScroll.bind(this, true)}
          disabled={disabledArrows.left}
        />
      )}
      {RightArrow && (
        <RightArrow
          onClick={onClickScroll.bind(this, false)}
          disabled={disabledArrows.right}
        />
      )}
      <ul
        ref={container}
        onScroll={onScroll}
        className={classNames(containerClassName)}
      >
        {children}
      </ul>
    </div>
  );
};

export default LinearLayout;
