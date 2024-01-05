import {Spin} from "antd";

import './loader.scss'

const PageLoaderAsync = () => {
    return (
        <div className="loader_component">
            <Spin size="large" />
        </div>
    )
}

export default PageLoaderAsync