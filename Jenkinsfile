pipeline {
    agent {
        kubernetes {
            label 'node-carbon'
        }
    }
    environment {
        ORG = 'molgenis'
        APP_NAME = 'molgenis-api-client'
    }
    stages {
        stage('Prepare') {
            steps {
                script {
                    env.GIT_COMMIT = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
                }
            }
        }
        stage('Install and test: [ pull request ]') {
            when {
                changeRequest()
            }
            steps {
                container('node') {
                    sh "yarn install"
                    sh "yarn test"
                }
            }
            post {
                always {
                    sh "curl -s https://codecov.io/bash | bash -s - -c -F unit -K"
                }
            }
        }
        stage('Install, test and build: [ master ]') {
            when {
                branch 'master'
            }
            steps {
                container('node') {
                    sh "yarn install"
                    sh "yarn test"
                    sh "yarn build"
                }
            }
            post {
                always {
                    sh "curl -s https://codecov.io/bash | bash -s - -c -F unit -K"
                }
            }
        }
        stage('Release: [ master ]') {
            when {
                buildingTag()
            }
            steps {
                container('node') {
                    sh "yarn install"
                    sh "yarn test"
                    sh "yarn build"
                    //TODO: push to registry.npmjs.org
                }
            }
        }
    }
//    post {
        // [ slackSend ]; has to be configured on the host, it is the "Slack Notification Plugin" that has to be installed
//        success {
//            notifySuccess()
//        }
//        failure {
//            notifyFailed()
//        }
//    }
}

def notifySuccess() {
    slackSend(channel: '#releases', color: '#00FF00', message: "RPM-build is successfully deployed on https://registry.npmjs.org: Job - <${env.BUILD_URL}|${env.JOB_NAME}> | #${env.BUILD_NUMBER}")
}

def notifyFailed() {
    slackSend(channel: '#releases', color: '#FF0000', message: "RPM-build has failed: Job - <${env.BUILD_URL}|${env.JOB_NAME}> | #${env.BUILD_NUMBER}")
}