import { Wrapper } from './styled'
import Submenu from './component/Submenu'

const elementRelationship = [
    {
        icon: "icon-zuhe",
        action: "",
    },
    {
        icon: "icon-quxiaozuhe",
        action: "",
    },
    {
        icon: "icon-suoding",
        action: "",
    },
    {
        icon: "icon-quxiaosuoding",
        action: "",
    },
    {
        icon: "icon-shuipingfanzhuan",
        action: "",
    },
    {
        icon: "icon-chuizhifanzhuan",
        action: "",
    },
    {
        icon: "icon-fuyuan",
        action: "",
    },
    {
        icon: "icon-fangda",
        action: "",
    },
    {
        icon: "icon-suoxiao",
        action: "",
    },
    {
        icon: "icon-fuzhi",
        action: "",
    },
    {
        icon: "icon-zhantie",
        action: "",
    },
    {
        icon: "icon-jianqie",
        action: "",
    },
    {
        icon: "icon-shanchu",
        action: "",
    },
    {
        icon: "icon-wangyuanjing",
        action: "",
    },
];

const engineerOperation = [
    {
        icon: "icon-xinjiangongcheng",
        action: "",
    },
    {
        icon: "icon-xinjianchuangkou",
        action: "",
    },
    {
        icon: "icon-dakaigongcheng",
        action: "",
    },
    {
        icon: "icon-baocun",
        action: "",
    },
    {
        icon: "icon-huifu",
        action: "",
    },
    {
        icon: "icon-chexiao",
        action: "",
    },
];

const layoutArray = [
    {
        icon: "icon-shangduiqi",
        action: "",
    },
    {
        icon: "icon-xiaduiqi",
        action: "",
    },
    {
        icon: "icon-zuoduiqi",
        action: "",
    },
    {
        icon: "icon-youduiqi",
        action: "",
    },
    {
        icon: "icon-chuizhijuzhongduiqi",
        action: "",
    },
    {
        icon: "icon-shuipingjuzhongduiqi",
        action: "",
    },
    {
        icon: "icon-zuishangceng",
        action: "",
    },
    {
        icon: "icon-shangyiceng",
        action: "",
    },
    {
        icon: "icon-zuixiaceng",
        action: "",
    },
    {
        icon: "icon-xiayiceng",
        action: "",
    },
    {
        icon: "icon-kuanduxiangtong",
        action: "",
    },
    {
        icon: "icon-gaoduxiangtong",
        action: "",
    },
    {
        icon: "icon-chuizhidengjianju",
        action: "",
    },
    {
        icon: "icon-shuipingdengjianju",
        action: "",
    },
    ...engineerOperation,
    ...elementRelationship,
];


const MenuBar = () => {

    return (
        <Wrapper>
            <div className='wrapper-content'>
                <Submenu props={layoutArray} />
            </div>
        </Wrapper>
    )
}

export default MenuBar;