import { Badge, Tooltip } from 'antd';
import EllipsisTooltip from '@/components/global/ellipsis-tooltip';
import styles from './style/index.less';

export interface StatusInfo {
  error: string[],
  success: string[],
  warning: string[],
  info: string[],
}

export interface StatusProps {
  style?: React.CSSProperties;
  info: StatusInfo;
  status: string;
  text: string;
}

const defaultProps = {
  error: ['error'],
  success: ['running'],
  warning: [''],
  info: ['pending'],
}

const Status = ({ style, status, text, info = defaultProps }: StatusProps) => {
  let className = styles.error;
  if ((info.error || []).indexOf((status + '').toLocaleLowerCase()) !== -1) {
    className = styles.error;
  } else if ((info.success || []).indexOf((status + '').toLocaleLowerCase()) !== -1) {
    className = styles.success;
  } else if ((info.info || []).indexOf((status + '').toLocaleLowerCase()) !== -1) {
    className = styles.info;
  } else {
    className = styles.warning;
  }
  return (
    <div className={styles[`status`]} style={{ display: "list-item", ...style! }} >
      <div className={styles[`badge-box`]} >
        <Badge style={{ float: 'left' }} className={className} status="processing" />
      </div>
      <Tooltip title={text || '未知'}>
        <div className={styles[`text-box`]}>
          <EllipsisTooltip title={text}>{text || '未知'}</EllipsisTooltip>
        </div>
      </Tooltip>
    </div>
  )
}

Status.defaultProps = {
  info: {
    error: ['error'],
    success: ['running'],
    warning: [''],
    info: ['pending'],
  }
}

export default Status;