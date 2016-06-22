/*
    Copyright (c) 2016 eyeOS

    This file is part of Open365.

    Open365 is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

var settings = {
	/**
	 * In which address this daemon will be listening for incoming connections.
	 */
	bindAddress: process.env.EYEOS_RABBITMQ_AUTH_BACKEND_HTTP_BIND_ADDRESS || '127.0.0.1',

	/**
	 * Port to open for incoming connections.
	 */
	port: process.env.EYEOS_RABBITMQ_AUTH_BACKEND_HTTP_PORT || 7108,

    /**
     * Master password will be sended by eyeos-cli to all services
     */
    masterUser: process.env.EYEOS_BUS_MASTER_USER || 'guest',
    masterPassword: process.env.EYEOS_BUS_MASTER_PASSWD || 'somepassword',

    disabled: process.env.EYEOS_BUS_AUTHENTICATION_ENABLED === 'false',
    /**
     * Where the service should go check the received credentials
     */
    vmuserservice: {
        fileserverBasePath: process.env.EYEOS_RABBITMQ_AUTH_BACKEND_HTTP_FILESERVERBASEPATH || '/var/vdi/fileserver',
        persistence: {
            host: process.env.EYEOS_RABBITMQ_AUTH_BACKEND_HTTP_MONGOHOST || "mongo.service.consul",
            port: process.env.EYEOS_RABBITMQ_AUTH_BACKEND_HTTP_MONGOPORT || "27017",
            db: process.env.EYEOS_RABBITMQ_AUTH_BACKEND_HTTP_MONGODB || "eyeos",
            collection: process.env.EYEOS_RABBITMQ_AUTH_BACKEND_HTTP_MONGOCOLLECTION || "vmuserservice"
        }
    },
    useCluster: process.env.EYEOS_RABBITMQ_AUTH_BACKEND_HTTP_USE_CLUSTER === "true" || false
};

module.exports = settings;
