import ic_past_red from 'images/ic_past_red.png'
import ic_message_red from 'images/ic_message_red.png'
import ic_users_red from 'images/ic_users_red.png'
import ic_logout_red from 'images/ic_logout_red.png'
import ic_logout_blue from 'images/ic_logout_blue.png'
import ic_lock_red from 'images/ic_lock_red.png'
import ic_motor_whiteRed from 'images/ic_cancel_blue.png'
import ic_wallet_green from 'images/ic_wallet_green.png'
import ic_management_green from 'images/ic_management_green.png'
import ic_history_green from 'images/ic_history_green.png'
import ic_apply_history from 'images/ic_apply_history.png'
import ic_manage_post from 'images/ic_manage_post.png'
import ic_change_pass_blue from 'images/ic_change_pass_blue.png'
import ic_change_pass_gradient from 'images/ic_change_pass_gradient.png'
import ic_log_out_gradient from 'images/ic_log_out_gradient.png'
import ic_mange_post from 'images/ic_mange_post.png'
import ic_mange_job from 'images/ic_mange_job.png'
import ic_star from 'images/ic_star.png'

export default list = {
    USER: [
        {
            name: 'Quản lý tin đăng',
            hasChild: true,
            screen: 'JobPostManage',
            icon: ic_mange_post
        },
        {
            name: 'Việc đã ứng tuyển',
            hasChild: true,
            screen: 'ApplyHistory',
            icon: ic_mange_job
        },
        {
            name: 'Việc đã lưu',
            hasChild: true,
            screen: 'JobSaved',
            icon: ic_star
        },
        {
            name: 'Đổi mật khẩu',
            hasChild: true,
            screen: 'ChangePassword',
            icon: ic_change_pass_gradient
        },
        { name: 'Đăng xuất', hasChild: false, screen: null, icon: ic_log_out_gradient }
    ],
    USER_SOCIAL: [
        {
            name: 'Quản lý tin đăng',
            hasChild: true,
            screen: 'JobPostManage',
            icon: ic_mange_post
        },
        {
            name: 'Việc đã ứng tuyển',
            hasChild: true,
            screen: 'ApplyHistory',
            icon: ic_mange_job
        },
        {
            name: 'Việc đã lưu',
            hasChild: true,
            screen: 'JobSaved',
            icon: ic_star
        },
        {
            name: 'Cập nhật mật khẩu',
            hasChild: true,
            screen: 'ConfirmPassword',
            icon: ic_change_pass_gradient
        },
        { name: 'Đăng xuất', hasChild: false, screen: null, icon: ic_log_out_gradient }
    ]
}
