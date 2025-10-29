import Headbar from "../../modules/Headbar/Headbar";
import { Wrapper, Menu, LabelItem, Content, FuncModule, DataDisplayModule } from "./styled"
import PresentationModule from "@/modules/TextEditionModule/PresentationModule"
import CanvasLab from "@/modules/CanvasLab";
import MenuBar from "@/modules/MenuBar";
import GraphicSelection from '@/modules/GraphicSelection'
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
                <DataDisplayModule>
                    <GraphicSelection />
                </DataDisplayModule>
                <Content>
                    <MenuBar />
                    {/* <div className="test"></div> */}
                    <PresentationModule />
                    {/* <CanvasLab /> */}
                </Content>
            </FuncModule>
        </Wrapper>
    )
}

export default Home;