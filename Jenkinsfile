pipeline {
    agent {
        label 'kaniko'
    }

    parameters {
        string(name: 'BUILD_BRANCH', defaultValue: 'main', description: 'Ветка для сборки')
        choice(name: 'DEPLOY_ENV', choices: ['stage'], description: 'Контур сборки')
    }

    environment {
        REGISTRY = 'habor.pksep.ru'
        IMAGE_NAME = 'library/erp-doc'
        BRANCH_NAME_SAFE = "${params.BUILD_BRANCH.replaceAll('/', '-')}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: "*/${params.BUILD_BRANCH}"]],
                    userRemoteConfigs: scm.userRemoteConfigs
                ])
            }
        }

        stage('Build And Push') {
            steps {
                container('kaniko') {
                    sh """
                    set -e
                    
                    mkdir -p /kaniko/.docker
                    cp /kaniko/.registry-secret/.dockerconfigjson /kaniko/.docker/config.json
                    export DOCKER_CONFIG=/kaniko/.docker

                    if [ "${params.DEPLOY_ENV}" = "dev" ]; then
                        IMAGE_PATH="${REGISTRY}/${IMAGE_NAME}"
                    else
                        IMAGE_PATH="${REGISTRY}/${IMAGE_NAME}-stage"
                    fi

                    /kaniko/executor \
                    --context "${WORKSPACE}" \
                    --dockerfile "${WORKSPACE}/Dockerfile" \
                    --registry-mirror "mirror.gcr.io" \
                    --destination "\$IMAGE_PATH:${BRANCH_NAME_SAFE}" \
                    --skip-tls-verify \
                    --cache=true \
                    --cache-repo="${REGISTRY}/${IMAGE_NAME}/cache"
                    """
                }
            }
        }
        stage('Deploy') {
            steps {
                container('kubectl') { 
                    sh """
                    set -e
                    if [ "${params.DEPLOY_ENV}" = "dev" ]; then
                        TARGET_NS="erp-dev"
                        FULL_IMAGE="${REGISTRY}/${IMAGE_NAME}:${BRANCH_NAME_SAFE}"
                    else
                        TARGET_NS="stage2"
                        FULL_IMAGE="${REGISTRY}/${IMAGE_NAME}-stage:${BRANCH_NAME_SAFE}"
                    fi

                    echo "Deploying image \$FULL_IMAGE to namespace \$TARGET_NS"

                    kubectl set image deployment/erp-doc erp-doc=\$FULL_IMAGE -n \$TARGET_NS

                    kubectl rollout restart deployment/erp-doc -n \$TARGET_NS

                    kubectl rollout status deployment/erp-doc -n \$TARGET_NS --timeout=120s
                    """
                }
            }
}
    }
}