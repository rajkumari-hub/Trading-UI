
pipeline {

    agent any

    tools {
        nodejs 'Node-22'
    }

    environment {
        DOCKER_IMAGE = 'rajkumari2010/trading-ui'
        DOCKER_CREDENTIALS = 'dockerhub-credentials'
    }

    stages {

        stage('Git Clone') {
            steps {
                git branch: 'master',
                    url: 'https://github.com/rajkumari-hub/Trading-UI.git'
            }
        }

        stage('Check Node and NPM') {
            steps {
                sh '''
                    node --version
                    npm --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    npm ci
                '''
            }
        }

        stage('Test') {
            steps {
                sh '''
                    npm test
                '''
            }
        }

        stage('Build') {
            steps {
                sh '''
                    npm run build
                '''
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                    docker build -t ${DOCKER_IMAGE}:${BUILD_NUMBER} -t ${DOCKER_IMAGE}:latest .
                '''
            }
        }

        stage('Docker Push') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: "${DOCKER_CREDENTIALS}",
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {
                    sh '''
                        echo "$DOCKER_PASSWORD" | docker login \
                            -u "$DOCKER_USERNAME" \
                            --password-stdin

                        docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}
                        docker push ${DOCKER_IMAGE}:latest

                        docker logout
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    docker pull ${DOCKER_IMAGE}:${BUILD_NUMBER}

                    docker stop trading-ui || true
                    docker rm trading-ui || true

                    docker run -d \
                        --name trading-ui \
                        -p 8081:80 \
                        ${DOCKER_IMAGE}:${BUILD_NUMBER}
                '''
            }
        }
    }

    post {
        success {
            echo 'Trading UI CI/CD pipeline completed successfully!'
        }

        failure {
            echo 'Trading UI CI/CD pipeline failed!'
        }
    }
}

