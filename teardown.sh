#!/usr/bin/env bash
set -euo pipefail

CLUSTER_NAME="collection-cluster"
K8S_DIR="$(dirname "$0")/k8s"

if command -v kubectl >/dev/null 2>&1; then
  echo "➡️  Suppression des ressources Kubernetes..."
  kubectl delete -f "${K8S_DIR}" --ignore-not-found=true || true
fi

if command -v kind >/dev/null 2>&1 && kind get clusters | grep -q "${CLUSTER_NAME}"; then
  echo "➡️  Suppression du cluster Kind '${CLUSTER_NAME}'..."
  kind delete cluster --name "${CLUSTER_NAME}"
fi

echo "➡️  Nettoyage des conteneurs docker-compose..."
docker compose down --remove-orphans 2>/dev/null || true

echo "✅  Nettoyage terminé."
