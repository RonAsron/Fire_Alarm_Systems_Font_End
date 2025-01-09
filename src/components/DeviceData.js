import React, { useEffect, useState } from 'react';
import { Layout, ConfigProvider, Table, Modal, Button, Form, Input, Spin, Card, Row, Col, message } from 'antd';
import { SmileOutlined, CheckCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined, GlobalOutlined, AppstoreOutlined } from '@ant-design/icons';
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import axiosInstance from './axiosConfig';
import '../style/antd-custom-theme.less'; // ใช้ไฟล์ Less สำหรับธีม

const { Header, Content } = Layout;

const DeviceDashboard = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await axiosInstance.get('devices/');
      setDevices(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching device data', err);
      setError(err);
      setLoading(false);
    }
  };

  const handleViewMap = (device) => {
    setSelectedDevice(device);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedDevice(null);
  };

  const columns = [
    {
      title: <span><AppstoreOutlined /> Name</span>,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: <span><GlobalOutlined /> ESP32</span>,
      dataIndex: 'esp_32',
      key: 'esp_32',
    },
    {
      title: <span><GlobalOutlined /> GPS Latitude</span>,
      dataIndex: 'gps_latitude',
      key: 'gps_latitude',
    },
    {
      title: <span><GlobalOutlined /> GPS Longitude</span>,
      dataIndex: 'gps_longitude',
      key: 'gps_longitude',
    },
    {
      title: <span><AppstoreOutlined /> Actions</span>,
      key: 'actions',
      render: (_, record) => (
        <Button type="primary" icon={<GlobalOutlined />} onClick={() => handleViewMap(record)}>
          View on Map
        </Button>
      ),
    },
  ];

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  const defaultCenter = {
    lat: 13.736717, // Default latitude (Bangkok)
    lng: 100.523186, // Default longitude
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#ff4500',
          colorLink: '#ff6347',
          colorSuccess: '#52c41a',
          colorWarning: '#faad14',
          colorError: '#f5222d',
          fontSizeBase: '14px',
          borderRadiusBase: '4px',
          borderColorBase: '#d9d9d9',
          headingColor: 'rgba(0, 0, 0, 0.85)',
          textColor: 'rgba(0, 0, 0, 0.65)',
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ background: '#ff4500', color: '#fff', textAlign: 'center', fontSize: '20px' }}>
          <SmileOutlined style={{ marginRight: 10 }} />
          Device Dashboard
        </Header>
        <Content style={{ padding: '20px' }}>
          {loading ? (
            <Spin tip="Loading...">
              <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <SmileOutlined style={{ fontSize: 24, color: '#ff4500' }} />
              </div>
            </Spin>
          ) : error ? (
            <div style={{ textAlign: 'center', color: 'red' }}>
              <h2>Error fetching data</h2>
              <p>{error.message}</p>
            </div>
          ) : (
            <>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Card
                    title={<span><CheckCircleOutlined style={{ color: '#52c41a' }} /> Total Devices</span>}
                    bordered={false}
                    style={{ textAlign: 'center' }}
                  >
                    <h2>{devices.length}</h2>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card
                    title={<span><ExclamationCircleOutlined style={{ color: '#faad14' }} /> Active Devices</span>}
                    bordered={false}
                    style={{ textAlign: 'center' }}
                  >
                    <h2>{devices.filter((device) => device.active).length}</h2>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card
                    title={<span><CloseCircleOutlined style={{ color: '#f5222d' }} /> Inactive Devices</span>}
                    bordered={false}
                    style={{ textAlign: 'center' }}
                  >
                    <h2>{devices.filter((device) => !device.active).length}</h2>
                  </Card>
                </Col>
              </Row>

              <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
                <Col span={16}>
                  <Card title={<span><AppstoreOutlined /> Device List</span>} bordered={false}>
                    <Table
                      dataSource={devices} 
                      columns={columns}
                      rowKey="id"
                      bordered
                      style={{ marginTop: 20 }}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card title={<span><GlobalOutlined /> Google Map View</span>} bordered={false}>
                    {selectedDevice ? (
                      <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
                        <GoogleMap
                          mapContainerStyle={mapContainerStyle}
                          center={{
                            lat: parseFloat(selectedDevice.gps_latitude) || defaultCenter.lat,
                            lng: parseFloat(selectedDevice.gps_longitude) || defaultCenter.lng,
                          }}
                          zoom={15}
                        >
                          <Marker
                            position={{
                              lat: parseFloat(selectedDevice.gps_latitude),
                              lng: parseFloat(selectedDevice.gps_longitude),
                            }}
                          />
                        </GoogleMap>
                      </LoadScript>
                    ) : (
                      <p style={{ textAlign: 'center' }}>Select a device to view on the map</p>
                    )}
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

export default DeviceDashboard;
