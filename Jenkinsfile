    def commitHash

    pipeline {

      agent any
      environment {
        DOCKER_CREDS = credentials('docker-registry')
      }

      stages{
        stage('Clone repository') {
          steps{
            script{
              def gitVars = checkout scm
              commitHash = gitVars.GIT_COMMIT
            }
          }
        }

        stage('Docker login') {
          steps{
            sh """
            docker login --username=${DOCKER_CREDS_USR} --password=${DOCKER_CREDS_PSW} http://10.101.120.57:5000
            """
          }
        }

        stage('Build image') {
          steps{
            sh """
            SERVICE_VERSION=${commitHash} docker-compose -f docker-compose.yml build
            SERVICE_VERSION=latest docker-compose -f docker-compose.yml build
            """
          }
        }
        
        stage('Build tagged image') {
          when { buildingTag() }
          steps{
            sh """
            SERVICE_VERSION=${env.TAG_NAME} docker-compose -f docker-compose.yml build
            """
          }
        }

        stage('Test image') {
          steps{
            sh """
            SERVICE_VERSION=latest docker-compose -f docker-compose.test.yml up
            SERVICE_VERSION=latest docker-compose rm -f -s -v
            """
          }
        }

        stage('Push image') {
          steps{
            sh """
            SERVICE_VERSION=${commitHash} docker-compose -f docker-compose.yml push
            SERVICE_VERSION=latest docker-compose -f docker-compose.yml push
            """
          }
        }
        
        stage('Push tagged image') {
          when { buildingTag() }
          steps{
            sh """
            SERVICE_VERSION=${env.TAG_NAME} docker-compose -f docker-compose.yml push
            """
          }
        }

        stage('Deploy code') {
          when { buildingTag() }
          steps{
            script{
              safejobname = env.JOB_NAME.replaceAll("\\.", "-")
                                        .replaceAll("\\/", "_")
              sh """
              SERVICE_VERSION=${env.TAG_NAME} docker stack deploy --with-registry-auth --compose-file docker-compose.yml ${safejobname}
              """
            }
          }
        }
      }
    }