set shell := ["bash", "-cu"]

lint:
    ruff parso tests
    black --check parso tests
    isort --check-only parso tests

fmt:
    black parso tests
    isort parso tests

test:
    pytest --cov=parso --cov-report=term-missing --cov-report=xml tests

clean:
    rm -rf .pytest_cache .coverage coverage.xml htmlcov dist build *.egg-info

dev-install:
    uv pip install -e . -d

precommit:
    pre-commit run --all-files

build:
    python -m build

publish:
    python -m twine upload dist/*

check:
    just lint
    just test
    just precommit
