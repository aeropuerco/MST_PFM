import { dateFormat } from '../../utils/dateFormat'
import postitemStyle from './PostItem.module.css'

export const PostItem = ({id, title, author, exerpt, date}) => {

    return (
        <div className={postitemStyle.item} data-id={id}>

                    <div className={postitemStyle.title}>{title}</div>
                    <div className={postitemStyle.exerpt}>{exerpt}</div>
                    <div className={postitemStyle.date}>{author} /// {dateFormat(date)}</div>
                
        </div>
    )
}
