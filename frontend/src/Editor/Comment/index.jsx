import React from 'react';
import cx from 'classnames';
import { useSpring, animated } from 'react-spring'

import { useDrag } from 'react-dnd';
import { ItemTypes } from '@/Editor/ItemTypes';
import CommentHeader from '@/Editor/Comment/CommentHeader';
import CommentBody from '@/Editor/Comment/CommentBody';
import CommentFooter from '@/Editor/Comment/CommentFooter';
import usePopover from '@/_hooks/use-popover';
import { commentsService } from '@/_services';

const Comment = ({ x, y, commentId }) => {
  const [loading, setLoading] = React.useState(true);
  const [thread, setThread] = React.useState([]);
  const [placement, setPlacement] = React.useState('left');
  const [open, trigger, content, setOpen] = usePopover(false);
  const [collected, drag] = useDrag(() => ({
    type: ItemTypes.COMMENT,
    item: { name: 'comment' },
  }));

  React.useLayoutEffect(() => {
    const { left } = trigger?.ref?.current?.getBoundingClientRect();

    console.log(trigger?.ref?.current?.getBoundingClientRect());
    if (left < 100) setPlacement('right');
    else setPlacement('left');
  }, [trigger]);

  React.useEffect(() => {
    if (open) {
      async function fetchData() {
        const { data } = await commentsService.getComment(commentId)
        setThread(data)
        setLoading(false)
        console.log(data)
      }
      fetchData();
    }
  }, [open])

  const commentFadeStyle = useSpring({ from: { opacity: 0 }, to: { opacity: 1 } })
  const popoverFadeStyle = useSpring({ opacity: open ? 1 : 0 })

  return (
    <animated.div
      ref={drag}
      className={cx("comments cursor-move", { 'open': open })}
      style={{
        transform: `translate(${x}px, ${y}px)`,
        ...commentFadeStyle
      }}
    >
      <label {...trigger} className="form-selectgroup-item">
        <span class="comment cursor-move avatar avatar-sm shadow-lg bg-white avatar-rounded">
          GG
        </span>
        <animated.div
          {...content}
          style={popoverFadeStyle}
          className={cx('card popover comment-popover', {
            'open-left': placement === 'left',
            'open-right': placement === 'right',
            show: open,
            hide: !open,
          })}
        >
          <div className="card-status-start bg-primary" />
          <CommentHeader />
          <CommentBody isLoading={loading} thread={thread} />
          <CommentFooter />
        </animated.div>
      </label>
    </animated.div>
  );
};

export default Comment;