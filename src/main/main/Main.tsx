import Headbar from "../../modules/Headbar/Headbar";
import { Wrapper, Menu, LabelItem, Content, FuncModule, DataDisplayModule } from "./styled"
import PresentationModule from "@/modules/TextEditionModule/PresentationModule"

const Home = () => {
    return (
        <Wrapper>
            <Headbar></Headbar>
            <FuncModule>
                <Menu>
                    <LabelItem></LabelItem>
                    <LabelItem></LabelItem>
                    <LabelItem></LabelItem>
                    <LabelItem></LabelItem>
                </Menu>
                <DataDisplayModule></DataDisplayModule>
                <Content>
                    <PresentationModule />
                </Content>
            </FuncModule>
        </Wrapper>
    )
}

export default Home;